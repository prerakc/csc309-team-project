import React, {useCallback, useContext, useState} from "react";
import {Button, Grid, TextField} from "@mui/material";

import {AccountContext} from "../../context/AccountContext";

import "./styles.css"
import {Navigate} from "react-router-dom";

export const Login = () => {

    const {isLoggedIn, login_API} = useContext(AccountContext);

    const [username, setUsername] = useState("");

    const handleUsernameChange = useCallback(event => setUsername(event.target.value), [setUsername]);

    const [password, setPassword] = useState("");

    const handlePasswordChange = useCallback(event => setPassword(event.target.value), [setPassword]);


    const handleLogin_API = useCallback(() => {
        login_API(username, password).then(valid => {
            if (!valid) {
                alert("Invalid username and/or password")
            }
        })//.catch(error => console.log(error))
    }, [login_API, username, password]);

    const keyPress = (e) => {
        if(e.keyCode === 13){
            handleLogin_API()
        }
     }

    return (
        <>
            {
                isLoggedIn ?
                    <Navigate to="/"/>
                    :
                    <div className="loginGrid">
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
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onKeyDown={keyPress}
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" onClick={handleLogin_API}>Login</Button>
                            </Grid>
                        </Grid>
                    </div>
            }
        </>
    );
};