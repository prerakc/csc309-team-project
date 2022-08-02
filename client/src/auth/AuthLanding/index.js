import Grid from "@mui/material/Grid";
import {Link, Navigate} from "react-router-dom";
import {Button, Typography} from "@mui/material";
import React, {useContext} from "react";

import "./styles.css"
import loginpic from "../../resources/loginaccount.png"
import {AccountContext} from "../../context/AccountContext";


export const AuthLanding = () => {
    const {isLoggedIn} = useContext(AccountContext);

    return (
        <>
            {isLoggedIn
                ?
                    <Navigate to="/"/>
                :
                    <div className="authGrid">
                        <img alt="" src={loginpic} className="loginpic"/>
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            spacing={12}
                        >
                            <Grid item>
                                <Link to="login" className="authButtonLink">
                                    <Button variant="contained" className="authButton">
                                        <Typography variant="h3">
                                            Login
                                        </Typography>
                                    </Button>
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="register" className="authButtonLink">
                                    <Button variant="contained" className="authButton">
                                        <Typography variant="h3">
                                            Register
                                        </Typography>
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </div>
            }
        </>
    );
};