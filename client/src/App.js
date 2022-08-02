import {Route, Routes} from "react-router-dom";
import React, { useContext, useEffect } from "react";
import {Root} from "./root";
import {AuthLanding} from "./auth/AuthLanding";
import {Login} from "./auth/Login";
import {Register} from "./auth/Register";
import Home from "./home";
import {Logout} from "./auth/Logout";
import {ListingView} from "./listings/ListingView";
import {AdminView} from "./admin/AdminView"
import {MyProfileContainer} from "./profile/MyProfileContainer"
import {AllProfiles} from "./profile/AllProfiles"
import {ChatView} from "./messsages/ChatView";
import {NotFound} from "./notfound";

import {AccountContext} from "./context/AccountContext";


import "./App.css"

export const App = () => {

    const {checkSession} = useContext(AccountContext);

    useEffect(() => {
        checkSession()
    }, [])

    return (
        <Routes>
            <Route path='/' element={<Root/>}/>
            <Route path='/auth' element={<AuthLanding/>}/>
            <Route path='/auth/login' element={<Login/>}/>
            <Route path='/auth/register' element={<Register/>}/>
            <Route path='/auth/logout' element={<Logout/>}/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/home/listings' element={<ListingView/>}/>
            <Route path='/home/messages' element={<ChatView/>}/>
            <Route path='/home/profile' element={<MyProfileContainer/>}/>
            <Route path='/home/profile/:username' element={<MyProfileContainer/>}/>
            <Route path='/home/profile/all' element={<AllProfiles/>}/>
            <Route path='/home/admin' element={<AdminView/>}/>
            <Route path='*' element={<NotFound/>}/>
        </Routes>
    );
};