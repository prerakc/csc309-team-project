import {Navigate} from "react-router-dom";
import React, {useContext, useEffect} from "react";
import {AccountContext} from "../../context/AccountContext";

export const Logout = () => {

    const {logout} = useContext(AccountContext);

    useEffect(() => {
        logout();
    }, [logout]);

    return (<Navigate to="/"/>);
};