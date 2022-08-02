import React, {createContext} from "react";
import {useListingsContext} from "../hooks/useListingsContext";

export const ListingsContext = createContext({});

export const ListingsContextProvider = (props) =>
    <ListingsContext.Provider value={useListingsContext()}>
        {props.children}
    </ListingsContext.Provider>;