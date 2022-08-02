import React, {useCallback, useContext, useEffect, useState} from "react";

import "./styles.css"
import {AccountContext} from "../../context/AccountContext";
import {MessageContext} from "../../context/MessageContext";
import {useAsyncFunctionMappedState} from "../../hooks/useAsyncFunctionMappedState";
import Card from "@mui/material/Card";
import ProfilePic from "../../profile/ProfilePic";

const getChatSelector = (key, other_profile, setChat, highlight) => {

    const color = highlight ? "#6495ED" : "white";

    return (
        <Card
            style={{backgroundColor: color}}
            key={key}
            sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderRadius: 1,
                p: 2,
            }}
            onClick={setChat}
        >
            <div>
                <div className={"child"}>
                    <ProfilePic account={other_profile} className={"messageAvatar"} variant={"circular"}/>
                </div>
                <div className={"child"}>
                    <div className={"chatSelectorName"}>
                        <p>{other_profile.name}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export const ChatSelector = (props) => {

    const {profile, getProfile_API} = useContext(AccountContext);

    const {chat, getConversations} = useContext(MessageContext);

    const [conversations, setConversations] = useState([]);

    const fetchData = async () => {
        const data = await getConversations(profile.username);
        setConversations(data);
    };

    useEffect(() => {
        fetchData()
    }, []);

    const chatSelectors = useAsyncFunctionMappedState(useCallback(async () => {
        const temp = [];
        if (conversations) {
            let key = 0;
            for (const c of conversations) {
                const other_person = (c.user_one === profile.username ? c.user_two : c.user_one);
                const other_profile = await getProfile_API(other_person);
                const selector = getChatSelector(key, other_profile, () => props.onClick(c, other_profile), chat?._id === c._id);
                temp.push(selector);
                key++;
            }
        } else {
            temp.push(
                <div className={"noConversations"} key={0}>
                    <p>It appears you have no existing conversations, click on a profile to start chatting!</p>
                </div>
            )
        }
        return temp;
    }, [conversations, getProfile_API, props, profile, chat]), []);

    return (
        <>
            {chatSelectors}
        </>
    );
};