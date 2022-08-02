import React, {createContext} from "react";
import {useMessageContext} from "../hooks/useMessageContext";

export const MessageContext = createContext({});

export const MessageContextProvider = (props) =>
    <MessageContext.Provider value={useMessageContext()}>
        {props.children}
    </MessageContext.Provider>;