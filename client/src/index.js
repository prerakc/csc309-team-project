import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter} from "react-router-dom";
import {AccountContextProvider} from "./context/AccountContext";
import {ListingsContextProvider} from "./context/ListingsContext";
import {App} from "./App";

import {StyledEngineProvider} from '@mui/material/styles';
import {MessageContextProvider} from "./context/MessageContext";


ReactDOM.render(
    <BrowserRouter>
        <AccountContextProvider>
            <MessageContextProvider>
                <ListingsContextProvider>
                    <StyledEngineProvider injectFirst>
                        <App/>
                    </StyledEngineProvider>
                </ListingsContextProvider>
            </MessageContextProvider>
        </AccountContextProvider>
    </BrowserRouter>,
    document.getElementById('root')
);
