import "./styles.css";

import React, {useContext} from "react";
import {useParams} from "react-router-dom";
import {uid} from "react-uid";

import {AccountContext} from "../../context/AccountContext";
import {MyProfile} from "../MyProfile"


export const MyProfileWrapper = () => {
    const {profile} = useContext(AccountContext);

    let {username} = useParams();

    return (
        <>
            {username === undefined
                ?
                    <MyProfile key={uid(profile.username)} displayedUser={profile.username}/>
                :
                    <MyProfile key={uid(username)} displayedUser={username}/>
            }
        </>
    );
};

export default MyProfileWrapper;
