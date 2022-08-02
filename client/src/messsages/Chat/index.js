import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import PublishIcon from '@mui/icons-material/Publish';

import "./styles.css"
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {InvoiceModal} from "../InvoiceModal";
import {Invoice} from "../Invoice";
import {useFunctionMappedState} from "../../hooks/useFunctionMappedState";
import {MessageContext} from "../../context/MessageContext";
import {AccountContext} from "../../context/AccountContext";
import ProfilePic from "../../profile/ProfilePic";
import {useAsyncFunctionMappedState} from "../../hooks/useAsyncFunctionMappedState";

const getSenderMessage = (chat, key, message, user, other) => {
    if (message.invoice) {
        return (
            <ListItem key={key}>
                <div className={"child"}>
                    <ProfilePic account={other} className={"messageAvatar"} variant={"circular"}/>
                </div>
                <div className={"child message"}>
                    <Card variant="outlined" sx={{backgroundColor: "#A9A9A9", p: 1}}>
                        <Invoice chat={chat} invoice={message} sender={true} user={user} other={other}/>
                    </Card>
                </div>
            </ListItem>
        );
    } else {
        return (
            <ListItem key={key}>
                <div className={"child"}>
                    <ProfilePic account={other} className={"messageAvatar"} variant={"circular"}/>
                </div>
                <div className={"child message"}>
                    <Card variant="outlined" sx={{backgroundColor: "#A9A9A9", p: 1}}>
                        <ListItemText primary={message.content}/>
                    </Card>
                </div>
            </ListItem>
        );
    }
};

const getUserMessage = (chat, key, message, user, other) => {
    if (message.invoice) {
        return (
            <ListItem key={key}>
                <div className={"right"}>
                    <div className={"child message"}>
                        <Card variant="outlined" sx={{backgroundColor: "#6495ED", p: 1}}>
                            <Invoice chat={chat} invoice={message} sender={false} user={user} other={other}/>
                        </Card>
                    </div>
                    <div className={"child"}>
                        <ProfilePic account={user} className={"messageAvatar"} variant={"circular"}/>
                    </div>
                </div>
            </ListItem>
        );
    } else {
        return (
            <ListItem key={key}>
                <div className={"right"}>
                    <div className={"child message"}>
                        <Card variant="outlined" sx={{backgroundColor: "#6495ED", p: 1}}>
                            <ListItemText primary={message.content}/>
                        </Card>
                    </div>
                    <div className={"child"}>
                        <ProfilePic account={user} className={"messageAvatar"} variant={"circular"}/>
                    </div>
                </div>
            </ListItem>
        );
    }
};

export const Chat = (props) => {

    const messagesEndRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef?.current?.scrollIntoView({behavior: "smooth"})
    }, [messagesEndRef]);

    const {profile} = useContext(AccountContext);

    const {messages, getConversation, addMessage, otherPerson} = useContext(MessageContext);

    const userProfile = useFunctionMappedState(useCallback(() => profile, [profile]));

    const loadConversation = useCallback(() => getConversation(props.chat._id), [props.chat._id]);

    useEffect(() => {
        const interval = setInterval(() => {
            loadConversation();
        }, 5000);
        return () => clearInterval(interval);
    }, [loadConversation]);

    useEffect(() => {
        loadConversation();
    }, [loadConversation]);

    const messageEntries = useFunctionMappedState(useCallback(() => {
        const temp = [];
        for (const [key, value] of messages?.entries()) {
            temp.push(value.sender === profile.username ? getUserMessage(props.chat, key, value, userProfile, otherPerson) : getSenderMessage(props.chat, key, value, userProfile, otherPerson))
        }
        return temp;
    }, [messages, profile, userProfile, otherPerson, props.chat]));

    const [input, setInput] = useState("");

    const handleChange = useCallback(event => {
        setInput(event.target.value);
    }, [setInput]);

    useEffect(() => {
        scrollToBottom();
    }, [scrollToBottom, messageEntries]);

    const refreshMessages = useCallback(() => {
        loadConversation()
    }, [loadConversation]);

    const sendMessage = useCallback(() => {
        if (input.length > 0) {
            addMessage(props.chat._id, profile.username, input);
            setInput("")
        }
    }, [input, setInput, addMessage, profile, props]);

    const [invoiceModal, setInvoiceModal] = useState(false);

    const openInvoiceModal = useCallback(() => setInvoiceModal(true), [setInvoiceModal]);

    const closeInvoiceModal = useCallback(() => setInvoiceModal(false), [setInvoiceModal]);

    return (
        <div className="chatBox">
            <div className="messageBox">
                <List>
                    {messageEntries}
                </List>
                <div ref={messagesEndRef}/>
            </div>
            <div className="messageInput">
                <div className={"child"}>
                    <Button variant="outlined" startIcon={<RefreshIcon/>} onClick={refreshMessages}>
                        Refresh
                    </Button>
                </div>
                <div className={"child"} style={{width: "60%"}}>
                    <TextField fullWidth label={"Message " + otherPerson.name} value={input}
                               onChange={handleChange}/>
                </div>
                <div className={"child"}>
                    <Button variant="outlined" startIcon={<SendIcon/>} onClick={sendMessage}>
                        Send
                    </Button>
                </div>
                <div className={"child"}>
                    <Button variant="outlined" startIcon={<PublishIcon/>} onClick={openInvoiceModal}>
                        Invoice
                    </Button>
                </div>
                <InvoiceModal open={invoiceModal} close={closeInvoiceModal} chat={props.chat}/>
            </div>
        </div>
    );
};