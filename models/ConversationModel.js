const mongoose = require('mongoose');

const Invoice = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        minlegth: 1
    },
    price: {
        type: Number,
        required: true
    },
    waiting: {
        type: String
    }
});

const Message = mongoose.Schema({
    invoice: {
        type: Boolean,
        required: true
    },
    sender: { // Must be either user_one or user_two, need to verify
        type: String,
        required: true,
        minlegth: 1,
        trim: true
    },
    content: {
        type: String,
        required: true,
        minlegth: 1
    },
    open: {
        type: Boolean,
    },
    status: {
        type: Number,
    },
    invoice_data: {
        type: Invoice
    }
});

const ConversationSchema = mongoose.Schema({
    user_one: {
        type: String,
        required: true,
        minlegth: 1,
        trim: true
    },
    user_two: {
        type: String,
        required: true,
        minlegth: 1,
        trim: true
    },
    open_invoice: {
        type: Boolean,
        required: true,
        default: false
    },
    conversation: {
        type: [Message],
        required: true,
        default: []
    }
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = {Conversation};
