import {NavBar} from "../nav";
import {Footer} from "../footer";
import React from "react";
import "./styles.css"

export const WrapNavBarAndFooter = (props) => {
    return (
        <>
            <NavBar/>
            <div className="childView">
                {props.children}
            </div>
            <Footer/>
        </>
    );
};