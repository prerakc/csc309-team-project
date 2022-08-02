import "./styles.css";

import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {AccountContext} from "../context/AccountContext";

export const Home = () => {
    const {isLoggedIn} = useContext(AccountContext);

    return (
        <>
            {isLoggedIn
                ? <Navigate to="/home/listings"/>
                : <Navigate to="/"/>
            }
        </>);
};

export default Home;