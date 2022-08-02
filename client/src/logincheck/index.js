import React, {useContext} from "react";
import {AccountContext} from "../context/AccountContext";
import {Navigate} from "react-router-dom";

export const LoginCheck = (props) => {
    const {isLoggedIn} = useContext(AccountContext);

    return (
        <>
            {isLoggedIn ?
                props.children
                :
                <Navigate to="/"/>
            }
        </>
    )
};