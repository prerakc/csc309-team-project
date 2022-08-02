import {useCallback, useContext, useState} from "react";

import ENV from "../config/config";

export const useAccountContext = () => {

    const [profile, setProfile] = useState({});

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [logoutListeners, setLogoutListeners] = useState([]);

    const addLogoutListener = (listener) => {
        setLogoutListeners(prev => [...prev, listener]);
    };

    const logout = useCallback(async () => {
        const url = `${ENV.api_host}/api/account/logout`;
        try {
            await fetch(url);
            setProfile({});
            setIsLoggedIn(false);
            logoutListeners.forEach(e => e());
        } catch (error) {
            console.log(error);
        }
    }, [setProfile, setIsLoggedIn, logoutListeners]);

    const getAllProfiles = async () => {
        const url = `${ENV.api_host}/api/profile`;
        try {
            let res = await fetch(url);
            if (res.status === 200) {
                return await res.json();
            } else {
                return {}
            }
        } catch (error) {
            console.log(error);
        }
    }

    const modifyPrivileges_API = async (username, type) => {
        const url = `${ENV.api_host}/api/profile/${username}/type`;
        const request = new Request(url, {
            method: "PATCH",
            body: JSON.stringify([{"op": "replace", "path": "/type", "value": type}]),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });
        try {
            let res = await fetch(request);
            if (res.status === 200) {
                if (username === profile.username && profile.type === "admin" && type === "user") {
                    const newProfile = JSON.parse(JSON.stringify(profile));
                    newProfile.type = "user";
                    setProfile(newProfile);
                }
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(error);
        }
    }

    const remove_API = useCallback(async (username) => {
        const url = `${ENV.api_host}/api/account/${username}`;
        const request = new Request(url, {
            method: "DELETE"
        });
        try {
            let res = await fetch(request);
            if (res.status === 200) {
                if (username === profile.username) {
                    logout()
                }
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(error);
        }
    }, [profile, logout])

    const getProfile_API = async (username) => {
        const url = `${ENV.api_host}/api/profile/${username}`;
        try {
            let res = await fetch(url);
            if (res.status === 200) {
                return await res.json();
            } else {
                return {}
            }
        } catch (error) {
            console.log(error);
        }
    }

    const modifyProfile_API = async (username, name, email, phone, description) => {
        const url = `${ENV.api_host}/api/profile/${username}/profile`;
        const request = new Request(url, {
            method: "PATCH",
            body: JSON.stringify([
                {"op": "replace", "path": "/name", "value": name},
                {"op": "replace", "path": "/email", "value": email},
                {"op": "replace", "path": "/phone", "value": phone},
                {"op": "replace", "path": "/description", "value": description}
            ]),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });
        try {
            let res = await fetch(request);
            if (res.status === 200) {
                setProfile(await res.json())
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(error);
        }
    }

    const modifyProfilePicture = async (username, imageData) => {
        const url = `${ENV.api_host}/api/profile/${username}/picture`;
        const request = new Request(url, {
            method: "post",
            body: imageData
        });

        try {
            let res = await fetch(request)
            if (res.status === 200) {
                const resJSON = await res.json()
                setProfile(resJSON)
                return resJSON
            } else {
                return {}
            }
        } catch (error) {
            console.log(error)
        }
    }

    const login_API = useCallback(async (username, password) => {
        const url = `${ENV.api_host}/api/account/login`;
        const request = new Request(url, {
            method: "post",
            body: JSON.stringify(
                {username: username, password: password}
            ),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });

        try {
            let res = await fetch(request)
            if (res.status === 200) {
                let resJSON = await res.json()
                setProfile(resJSON);
                setIsLoggedIn(true);
                return true;
            } else {
                return false
            }
        } catch (error) {
            console.log(error)
        }
    }, [setProfile, setIsLoggedIn]);

    const register_API = useCallback(async (username, password) => {
        const url = `${ENV.api_host}/api/account/register`;
        const request = new Request(url, {
            method: "post",
            body: JSON.stringify(
                {username: username, password: password}
            ),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });

        try {
            let res = await fetch(request)
            if (res.status === 200) {
                return await login_API(username, password)
            } else {
                return false
            }
        } catch (error) {
            console.log(error)
        }
    }, [login_API])

    const addReview = useCallback(async (username, type, reviewer, rating, description, date) => {
        if (type === "student" || type === "tutor") {
            const url = `${ENV.api_host}/api/profile/${username}/review/${type}`;
            const request = new Request(url, {
                method: "post",
                body: JSON.stringify({
                    reviewer: reviewer,
                    rating: rating,
                    description: description,
                    date: date
                }),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            });

            try {
                let res = await fetch(request)
                if (res.status === 200) {
                    return true
                } else {
                    return false
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            return false
        }
    }, [])

    const checkSession = useCallback(async () => {
        if (ENV.env === 'production') {
            const url = `${ENV.api_host}/api/account/check-session`;

            try {
                let res = await fetch(url)
                if (res.status === 200) {
                    let resJSON = await res.json()
                    setProfile(resJSON);
                    setIsLoggedIn(true);
                    return true;
                } else {
                    return false
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            return;
        }
    }, [])

    return {
        profile,
        isLoggedIn,
        logout,
        getAllProfiles,
        modifyPrivileges_API,
        remove_API,
        getProfile_API,
        modifyProfile_API,
        modifyProfilePicture,
        login_API,
        register_API,
        addReview,
        checkSession,
        addLogoutListener
    };
};