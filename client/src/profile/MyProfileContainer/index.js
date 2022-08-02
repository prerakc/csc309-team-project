import "./styles.css";

import React from "react";
import {MyProfileWrapper} from "../MyProfileWrapper"
import {LoginCheck} from "../../logincheck";
import { WrapNavBarAndFooter } from "../../common/wrapper";


export const MyProfileContainer = () => {
    return (
        <LoginCheck>
            <WrapNavBarAndFooter>
                <MyProfileWrapper/>
            </WrapNavBarAndFooter>
        </LoginCheck>
    );
};

export default MyProfileContainer;
