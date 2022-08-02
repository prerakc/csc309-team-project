import {useCallback, useContext, useEffect, useState} from "react";
import {AccountContext} from "../context/AccountContext";
import ENV from "../config/config";


export const useMessageContext = () => {

    const {addReview, addLogoutListener} = useContext(AccountContext);

    useEffect(() => addLogoutListener(clean), []);

    const [messages, setMessages] = useState([]);

    const [chat, setChatElement] = useState(null);

    const [otherPerson, setOtherPerson] = useState(null);

    const setChat = (chat, otherPerson) => {
        setChatElement(chat);
        setOtherPerson(otherPerson);
    };

    const createConversation = async (user_one, user_two) => {
        const conversation =
            {
                user_one: user_one,
                user_two: user_two
            };

        const url = `${ENV.api_host}/api/conversation`;

        const request = new Request(url,
            {
                method: "post",
                body: JSON.stringify(conversation),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            });
        try {
            let res = await fetch(request);
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    };

    const getConversations = async user => {
        const url = `${ENV.api_host}/api/conversation/` + user;
        try {
            let res = await fetch(url);
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    };

    const getConversation = async (conversation_id) => {
        const url = `${ENV.api_host}/api/conversation/` + conversation_id + `/message`;
        try {
            let res = await fetch(url);
            setMessages(await res.json());
        } catch (error) {
            console.log(error);
        }
    };

    const addMessage = async (conversation_id, sender, content) => {
        const message =
            {
                invoice: false,
                sender: sender,
                content: content
            };

        const url = `${ENV.api_host}/api/conversation/` + conversation_id + `/message`;

        const request = new Request(url,
            {
                method: "post",
                body: JSON.stringify(message),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            });
        try {
            let res = await fetch(request);
            setMessages(await res.json());
        } catch (error) {
            console.log(error);
        }
    };

    const addInvoice = async (conversation_id, sender, date, time, location, price) => {
        const invoice =
            {
                invoice: true,
                open: true,
                status: 0,
                sender: sender,
                content: "Invoice Sent",
                invoice_data: {
                    date: date,
                    time: time,
                    location: location,
                    price: price
                },
            };

        const url = `${ENV.api_host}/api/conversation/` + conversation_id + `/message`;

        const request = new Request(url,
            {
                method: "post",
                body: JSON.stringify(invoice),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            });
        try {
            let res = await fetch(request);
            setMessages(await res.json());
            return true;
        } catch (error) {
            return false;
        }
    };

    const withDrawInvoice = async (conversation_id) => {

        const url = `${ENV.api_host}/api/conversation/` + conversation_id + `/withdraw`;

        const request = new Request(url,
            {
                method: "PATCH"
            });
        try {
            let res = await fetch(request);
            setMessages(await res.json());
        } catch (error) {
            console.log(error);
        }
    };

    const rejectInvoice = async (conversation_id) => {
        const url = `${ENV.api_host}/api/conversation/` + conversation_id + `/reject`;

        const request = new Request(url,
            {
                method: "PATCH"
            });
        try {
            let res = await fetch(request);
            setMessages(await res.json());
        } catch (error) {
            console.log(error);
        }
    };

    const acceptInvoice = async (conversation_id) => {
        const url = `${ENV.api_host}/api/conversation/` + conversation_id + `/accept`;

        const request = new Request(url,
            {
                method: "PATCH"
            });
        try {
            let res = await fetch(request);
            setMessages(await res.json());
        } catch (error) {
            console.log(error);
        }
    };

    const postReview = async (conversation_id, username, type, reviewer, rating, description) => {
        addReview(username, type, reviewer, rating, description, new Date());

        const url = `${ENV.api_host}/api/conversation/` + conversation_id + `/review`;

        const request = new Request(url,
            {
                method: "PATCH",
                body: JSON.stringify({
                    waiting: username
                }),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            });
        try {
            let res = await fetch(request);
            setMessages(await res.json());
        } catch (error) {
            console.log(error);
        }
    };

    const clean = useCallback(() => {
        setMessages([]);
        setChatElement(null);
        setOtherPerson(null);
    }, [setMessages, setChatElement, setOtherPerson]);


    return {
        messages,
        getConversations,
        createConversation,
        getConversation,
        addMessage,
        addInvoice,
        withDrawInvoice,
        rejectInvoice,
        acceptInvoice,
        postReview,
        chat,
        otherPerson,
        setChat,
        clean
    };
};