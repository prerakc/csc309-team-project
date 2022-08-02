import React from "react";

import {Avatar} from "@mui/material";

import {Link} from "react-router-dom";

export const ProfilePic = (props) => {

    return (
        <Link to={`/home/profile/${props.account.username}`}>
            <Avatar
                src={props.account.picture}
                alt=""
                className={props.className}
                variant={props.variant}
            />
        </Link>
    );
};

export default ProfilePic;
