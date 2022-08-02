import React, {useContext} from "react";
import {AccountContext} from "../context/AccountContext";
import {Navigate} from "react-router-dom";

export const Root = () => {

    const {isLoggedIn} = useContext(AccountContext);

    return (
        <>
            {
                isLoggedIn ?
                    <Navigate to="/home"/> :
                    <Navigate to="/auth"/>
            }
        </>);
};