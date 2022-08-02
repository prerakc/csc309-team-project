import "./styles.css";

import React, {useContext} from "react";
import {AccountContext} from "../../context/AccountContext";
import {Reports} from "../Reports"
import { LoginCheck } from "../../logincheck";
import { WrapNavBarAndFooter } from "../../common/wrapper";

export const AdminView = () => {
    const {profile} = useContext(AccountContext);

    return (
        <>
            <LoginCheck>
                <WrapNavBarAndFooter>
                    {profile.type === "admin"
                        ?
                            <Reports/>
                        :
                            <h1>Not Authorized: Insufficient Admin Credentials.</h1>
                    }
                </WrapNavBarAndFooter>
            </LoginCheck>
        </>
    );
};

export default AdminView;