import React, {createContext} from "react";
import {useAccountContext} from "../hooks/useAccountContext";

export const AccountContext = createContext({});

export const AccountContextProvider = (props) =>
    <AccountContext.Provider value={useAccountContext()}>
        {props.children}
    </AccountContext.Provider>;