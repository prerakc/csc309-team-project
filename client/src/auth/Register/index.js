import React, {useCallback, useContext, useState} from "react";
import {Navigate} from "react-router-dom";

import {Button, Grid, TextField} from "@mui/material";
import {AccountContext} from "../../context/AccountContext";

import "./styles.css";

export const Register = () => {

    const {isLoggedIn, register_API} = useContext(AccountContext);

    const [username, setUsername] = useState("");

    const handleUsernameChange = useCallback(event => setUsername(event.target.value), [setUsername]);

    const [password, setPassword] = useState("");

    const handlePasswordChange = useCallback(event => setPassword(event.target.value), [setPassword]);

    const handleRegister_API = useCallback(() => {
        if (username === '' || password === '') {
            alert("Username and/or password cannot be blank")
        } else {
            register_API(username, password).then(valid => {
                if (!valid) {
                    alert("Username already taken")
                }
            })
        }
    }, [register_API, username, password]);

    return (
        <>
            {isLoggedIn
                ?
                    <Navigate to="/"/>
                :
                    <div className="registerGrid">
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            spacing={8}
                        >
                            <Grid item>
                                <TextField
                                    label="Username"
                                    name="username"
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="Password"
                                    name="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" onClick={handleRegister_API}>Register</Button>
                            </Grid>
                        </Grid>
                    </div>
            }
        </>
    );
};