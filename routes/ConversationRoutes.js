const log = console.log;
const env = process.env.NODE_ENV

// express
const express = require('express');
const router = express.Router(); // Express Router

// import the student mongoose model
const {Conversation} = require('../models/ConversationModel');
const {Account} = require('../models/AccountModel');

// helpers/middlewares
const {mongoChecker, isMongoError} = require("./helpers/mongo_helpers");
const {userLoggedIn} = require("./helpers/authentication");

const {ObjectID} = require('mongodb')


router.post('/api/conversation', mongoChecker, userLoggedIn, async (req, res) => {

    const user_one = req.body.user_one;
    const user_two = req.body.user_two;

    if (!user_one || !user_two) {
        res.status(400).send("Incorrect payload");
        return
    }

    if (env === 'production') {
        if (!(user_one === req.session.username || user_two === req.session.username)) {
            res.status(400).send("You cannot create a conversation you're not in.");
            return;
        }
    }

    try {

        const user_one_d = await Account.findOne({username: user_one});
        const user_two_d = await Account.findOne({username: user_two});

        if (!user_one_d || !user_two_d) {
            res.status(400).send("Atleast one account provided is not registered");
            return
        }

        const result1 = await Conversation.findOne({
            $or: [
                {
                    user_one: user_one,
                    user_two: user_two
                },
                {
                    user_one: user_two,
                    user_two: user_one
                }
            ]
        });

        if (!result1) {
            const conversation = new Conversation({
                user_one: user_one,
                user_two: user_two
            });

            const result2 = await conversation.save();

            res.send(result2);
        } else {
            res.send(result1);
        }
    } catch (error) {
        log(error);
        if (isMongoError(error)) {
            res.status(500).send('Internal server error');
        } else {
            res.status(400).send('Bad Request');
        }
    }
});


router.get('/api/conversation/:username', mongoChecker, userLoggedIn, async (req, res) => {

    const username = req.params?.username;

    if (!username) {
        res.status(400).send("Username cannot be empty");
        return;
    }

    if (env === 'production') {
        if (username !== req.session.username) {
            res.status(400).send("You cannot fetch other people's conversation");
            return;
        }
    }

    try {
        const result = await Conversation.find({
            $or: [
                {
                    user_one: username
                },
                {
                    user_two: username
                }
            ]
        });

        if (!result) {
            res.status(404).send('Resource not found');
        } else {
            res.send(result);
        }

    } catch (error) {
        log(error);
        if (isMongoError(error)) {
            res.status(500).send('Internal server error');
        } else {
            res.status(400).send('Bad Request');
        }
    }
});

router.post('/api/conversation/:conversation/message', mongoChecker, userLoggedIn, async (req, res) => {
    const conversation_id = req.params?.conversation;

    if (!ObjectID.isValid(conversation_id)) {
        res.status(400).send("Bad Id");
        return;
    }

    const invoice = req.body.invoice;
    const sender = req.body.sender;
    const content = req.body.content;

    if ((invoice === undefined) || !sender || !content) {
        res.status(400).send("Invalid Payload");
        return;
    }

    const date = req.body.invoice_data?.date;
    const time = req.body.invoice_data?.time;
    const location = req.body.invoice_data?.location;
    const price = req.body.invoice_data?.price;

    if (invoice) {
        if (!date || !time || !location || !price) {
            res.status(400).send("Invalid Payload");
            return;
        }
    }

    try {
        const conversation = await Conversation.findOne({_id: conversation_id});

        if (!conversation) {
            res.status(404).send('Resource not found');
        } else {

            if (env === 'production') {
                if (!(conversation.user_one === req.session.username || conversation.user_two === req.session.username)) {
                    res.status(400).send("You cannot send a message in a conversation you're not apart of");
                    return;
                }
            }

            const message = {
                invoice: invoice,
                sender: sender,
                content: content
            };

            if (message.invoice) { // invoice message

                if (conversation.open_invoice) {
                    res.status(400).send('Open invoice still exists');
                    return;
                }

                message.open = false;
                message.status = 0;
                message.invoice_data = {
                    date: date,
                    time: time,
                    location: location,
                    price: price
                };

                conversation.open_invoice = true;
            }

            conversation.conversation = [...conversation.conversation, message];
            await conversation.save();
            res.send(conversation.conversation);
        }

    } catch (error) {
        log(error);
        if (isMongoError(error)) {
            res.status(500).send('Internal server error');
        } else {
            res.status(400).send('Bad Request');
        }
    }
});

router.get('/api/conversation/:conversation/message', mongoChecker, userLoggedIn, async (req, res) => {
    const conversation_id = req.params?.conversation;

    if (!ObjectID.isValid(conversation_id)) {
        res.status(404).send("Bad Id");
        return;
    }

    try {
        const conversation = await Conversation.findOne({_id: conversation_id});

        if (!conversation) {
            res.status(404).send('Resource not found');
        } else {
            if (env === 'production') {
                if (!(conversation.user_one === req.session.username || conversation.user_two === req.session.username)) {
                    res.status(400).send("You cannot get messages in a conversation you're not apart of");
                    return;
                }
            }

            res.send(conversation.conversation);
        }

    } catch (error) {
        log(error);
        if (isMongoError(error)) {
            res.status(500).send('Internal server error');
        } else {
            res.status(400).send('Bad Request');
        }
    }
});

router.patch('/api/conversation/:conversation/:operation', mongoChecker, userLoggedIn, async (req, res) => {

    const conversation_id = req.params?.conversation;
    const operation = req.params?.operation;

    if (!ObjectID.isValid(conversation_id)) {
        res.status(404).send("Bad Id");
        return;
    }

    try {
        const conversation = await Conversation.findOne({_id: conversation_id});

        if (!conversation) {
            res.status(404).send('Resource not found');
        } else {

            if (!(operation === "withdraw" || operation === "reject" || operation === "accept" || operation === "review")) {
                res.status(404).send('Invalid resource');
            } else {

                if (env === 'production') {
                    if (!(conversation.user_one === req.session.username || conversation.user_two === req.session.username)) {
                        res.status(400).send("You cannot update a messages in a conversation you're not apart of");
                        return;
                    }
                }

                const invoiceMessage = conversation.conversation.slice().reverse().find(e => e.invoice === true);


                if (invoiceMessage.status === 0) {
                    if (operation === "withdraw") {

                        if (env === 'production') {
                            if (invoiceMessage.sender !== req.session.username) {
                                res.status(400).send("You cannot withdraw an invoice you did not send");
                                return;
                            }
                        }

                        invoiceMessage.open = false;
                        invoiceMessage.status = -1;
                        invoiceMessage.content = "Invoice Withdrew";

                        conversation.open_invoice = false;
                    } else if (operation === "reject") {

                        if (env === 'production') {
                            if (invoiceMessage.sender === req.session.username) {
                                res.status(400).send("You cannot reject an invoice you sent");
                                return;
                            }
                        }

                        invoiceMessage.open = false;
                        invoiceMessage.status = -2;
                        invoiceMessage.content = "Invoice Rejected";

                        conversation.open_invoice = false;
                    } else if (operation === "accept") {

                        if (env === 'production') {
                            if (invoiceMessage.sender === req.session.username) {
                                res.status(400).send("You cannot accept an invoice you sent");
                                return;
                            }
                        }

                        invoiceMessage.open = false;
                        invoiceMessage.status = 1;
                        invoiceMessage.content = "Invoice Accepted";
                    }
                } else {
                    if (operation === "review") {
                        if (invoiceMessage.status === 1) {

                            if (!(req.body.waiting === conversation.user_one || req.body.waiting === conversation.user_two)) {
                                res.status(400).send("Waiting must be one of the user's in the conversation");
                                return;
                            }

                            invoiceMessage.status = 2;
                            invoiceMessage.content = "Waiting on Reviews";
                            invoiceMessage.invoice_data.waiting = req.body.waiting;
                        } else {
                            invoiceMessage.open = false;
                            invoiceMessage.status = 3;
                            invoiceMessage.content = "Invoice Closed";

                            conversation.open_invoice = false;
                        }
                    }
                }

                const result = await conversation.save();
                res.send(result.conversation);
            }
        }

    } catch (error) {
        log(error);
        if (isMongoError(error)) {
            res.status(500).send('Internal server error');
        } else {
            res.status(400).send('Bad Request');
        }
    }
});


module.exports = router;
