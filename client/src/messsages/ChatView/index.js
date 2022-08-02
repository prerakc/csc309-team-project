import React, {useContext} from "react";
import {Chat} from "../Chat";
import {ChatSelector} from "../ChatSelector";

import "./styles.css"
import {WrapNavBarAndFooter} from "../../common/wrapper";
import {LoginCheck} from "../../logincheck";
import {MessageContext} from "../../context/MessageContext";

export const ChatView = () => {

    const {chat, setChat} = useContext(MessageContext);

    return (
        <LoginCheck>
            <WrapNavBarAndFooter>
                {chat ?
                    <div className="chatView">
                        <div className="chatSelector">
                            <ChatSelector onClick={setChat}/>
                        </div>
                        <div className="chatWindow">
                            <Chat chat={chat}/>
                        </div>
                    </div>
                    :
                    <ChatSelector onClick={setChat}/>
                }
            </WrapNavBarAndFooter>
        </LoginCheck>
    );
};