import "./styles.css";

import React, {useCallback, useContext, useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {uid} from "react-uid";

import {AccountContext} from "../../context/AccountContext";
import ProfilePic from "../ProfilePic";

import {Rating, Typography} from "@mui/material";
import {Box} from "@mui/material";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import {Input} from '@mui/material';
import {Avatar} from "@mui/material";
import {Grid} from "@mui/material";
import {Paper} from "@mui/material";
import {MessageContext} from "../../context/MessageContext";

export const MyProfile = props => {
    const navigate = useNavigate();

    const {displayedUser} = props;

    const {profile, getProfile_API, modifyProfile_API, modifyProfilePicture} = useContext(AccountContext);

    const {setChat, createConversation} = useContext(MessageContext);

    const [displayedProfile, setDisplayedProfile] = useState({})

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [phone, setPhone] = useState("");

    const [description, setDescription] = useState("");

    const fetchData = async () => {
        try {
            const data = await getProfile_API(displayedUser)
            if (data.constructor === Object && Object.keys(data).length !== 0) {
                data.student_reviews = await Promise.all(data.student_reviews.map(async i => {
                    const theirProfile = await getProfile_API(i.reviewer)

                    if (theirProfile.constructor === Object && Object.keys(theirProfile).length !== 0) {
                        return {
                            reviewer: i.reviewer,
                            rating: i.rating,
                            description: i.description,
                            date: i.date,
                            profile: theirProfile
                        }
                    } else {
                        return {
                            reviewer: i.reviewer,
                            rating: i.rating,
                            description: i.description,
                            date: i.date,
                            profile: {
                                picture: "https://res.cloudinary.com/dxbeljoy1/image/upload/v1648698823/new_account.jpg"
                            }
                        }
                    }
                }))

                data.tutor_reviews = await Promise.all(data.tutor_reviews.map(async i => {
                    const theirProfile = await getProfile_API(i.reviewer)

                    if (theirProfile.constructor === Object && Object.keys(theirProfile).length !== 0) {
                        return {
                            reviewer: i.reviewer,
                            rating: i.rating,
                            description: i.description,
                            date: i.date,
                            profile: theirProfile
                        }
                    } else {
                        return {
                            reviewer: i.reviewer,
                            rating: i.rating,
                            description: i.description,
                            date: i.date,
                            profile: {
                                picture: "https://res.cloudinary.com/dxbeljoy1/image/upload/v1648698823/new_account.jpg"
                            }
                        }
                    }
                }))
                
                setDisplayedProfile(data)
                setName(data.name)
                setEmail(data.email)
                setPhone(data.phone)
                setDescription(data.description)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const [mode, setMode] = useState("Edit");

    const handleNameChange = useCallback((event) => {
        const value = event.target.value;
        setName(value);
    }, [setName]);

    const handleEmailChange = useCallback((event) => {
        const value = event.target.value;
        setEmail(value);
    }, [setEmail]);

    const handlePhoneChange = useCallback((event) => {
        const value = event.target.value;
        setPhone(value);
    }, [setPhone]);

    const handleDescriptionChange = useCallback((event) => {
        const value = event.target.value;
        setDescription(value);
    }, [setDescription]);

    const handleModeChange_API = useCallback(async (event) => {
        if (mode === "Edit") {
            setMode("Save");
        } else {
            setMode("Edit");

            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

            if (emailRegex.test(email) === false) {
                alert("Invalid email format - Modifications weren't saved");
                await fetchData()
            } else {
                const imageFormElement = document.querySelector("#image")
                const imageInputElement = document.querySelector("#image input")
                const imageData = new FormData(imageFormElement);
    
                if (imageInputElement.files.length) {
                    const newProfile = await modifyProfilePicture(profile.username, imageData)
    
                    if (Object.keys(newProfile).length === 0 && newProfile.constructor === Object) {
                        alert("Modifications weren't saved");
                    } else {
                        setDisplayedProfile(oldProfile => {
                            const newProfile2 = JSON.parse(JSON.stringify(oldProfile))
                            newProfile2.picture = newProfile.picture
                            return newProfile2
                        })
                    }
                }
    
                const valid = await modifyProfile_API(profile.username, name, email, phone, description)
    
                if (!valid) {
                    alert("Error - Modifications weren't saved");
                }
            }
        }
    }, [mode, setMode, profile, modifyProfile_API, modifyProfilePicture, name, email, phone, description, setDisplayedProfile, fetchData]);

    const handleMessage = useCallback(async () => {
        const c = await createConversation(profile.username, displayedProfile.username);
        setChat(c, displayedProfile);
        navigate("/home/messages");
    }, [navigate, createConversation, profile, setChat, displayedProfile]);

    return (
        <>
            {Object.keys(displayedProfile).length === 0 && displayedProfile.constructor === Object
                ?
                    <h1>Unknown User.</h1>
                :
                    <>
                        <Grid container className="GiveFlex">
                            <Grid container item xs={4} className="GiveFlex ProfileContainer" direction="column" alignItems="center"
                                justifyContent="center">
                                <Avatar
                                    src={displayedProfile.picture}
                                    alt=""
                                    className="BioProfilePicture"

                                />
                                <Card id="ProfileInfo">
                                    <Grid container>
                                        {displayedProfile.username === profile.username
                                            ?
                                                <Grid item>
                                                    <Box className="MarginUpDownOne">
                                                        <Typography
                                                            className="BioBoldedText"
                                                        > New Profile Image:
                                                        </Typography>
                                                        <form id="image">
                                                            <input disabled={mode === "Edit"} name="image" type="file" />
                                                        </form>
                                                    </Box>
                                                </Grid>
                                            :
                                                null
                                        }
                                        <Grid container item>
                                            <Grid item xs={6}>
                                                <Box className="MarginUpDownOne">
                                                    <Typography
                                                        className="BioBoldedText"
                                                    > User ID:
                                                    </Typography>
                                                    &nbsp;
                                                    <Input
                                                        readOnly
                                                        disableUnderline
                                                        value={displayedProfile.username}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box className="MarginUpDownOne">
                                                    <Typography
                                                        className="BioBoldedText"
                                                    > Type:
                                                    </Typography>
                                                    &nbsp;
                                                    <Input
                                                        readOnly
                                                        disableUnderline
                                                        value={displayedProfile.type}
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        <Grid container item>
                                            <Grid item xs={6}>
                                                <Box className="MarginUpDownOne">
                                                    <Typography
                                                        className="BioBoldedText"
                                                    > Student Rating:
                                                    </Typography>
                                                    <br/>
                                                    <Rating
                                                        readOnly
                                                        value={displayedProfile.student_rating}
                                                        precision={0.2}
                                                        size="large"
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box className="MarginUpDownOne">
                                                    <Typography
                                                        className="BioBoldedText"
                                                    > Tutor Rating:
                                                    </Typography>
                                                    <br/>
                                                    <Rating
                                                        readOnly
                                                        value={displayedProfile.tutor_rating}
                                                        precision={0.2}
                                                        size="large"
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        <Grid container item className="GiveFlex" direction="column">
                                            <Grid item>
                                                <Box className="MarginUpDownOne">
                                                    <Typography
                                                        className="BioBoldedText"
                                                    > Name:
                                                    </Typography>
                                                    &nbsp;
                                                    <Input
                                                        name="name"
                                                        readOnly={mode === "Edit"}
                                                        disableUnderline={mode === "Edit"}
                                                        value={name}
                                                        onChange={handleNameChange}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item>
                                                <Box className="MarginUpDownOne">
                                                    <Typography
                                                        className="BioBoldedText"
                                                    > Email:
                                                    </Typography>
                                                    &nbsp;
                                                    <Input
                                                        name="email"
                                                        readOnly={mode === "Edit"}
                                                        disableUnderline={mode === "Edit"}
                                                        value={email}
                                                        onChange={handleEmailChange}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item>
                                                <Box className="MarginUpDownOne">
                                                    <Typography
                                                        className="BioBoldedText"
                                                    > Phone:
                                                    </Typography>
                                                    &nbsp;
                                                    <Input
                                                        name="phone"
                                                        readOnly={mode === "Edit"}
                                                        disableUnderline={mode === "Edit"}
                                                        value={phone}
                                                        onChange={handlePhoneChange}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item>
                                                <Box className="MarginUpDownOne">
                                                    <Typography
                                                        className="BioBoldedText"
                                                    > Description:
                                                    </Typography>
                                                    <Input
                                                        name="description"
                                                        multiline
                                                        fullWidth
                                                        readOnly={mode === "Edit"}
                                                        disableUnderline={mode === "Edit"}
                                                        value={description}
                                                        onChange={handleDescriptionChange}
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        {displayedProfile.username === profile.username
                                            ?
                                            <Grid container>
                                                <Grid item xs={3}>
                                                    <Button
                                                        variant="contained"
                                                        onClick={handleModeChange_API}
                                                        className="MarginUpDownTwo"
                                                    > {mode}
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={9}>
                                                    <Link to="/home/profile/all" className='LinkButton'>
                                                        <Button className="MarginUpDownTwo" variant="contained">
                                                            View All Profiles
                                                        </Button>
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                            :
                                            <Button variant="contained" onClick={handleMessage}>
                                                Message
                                            </Button>
                                        }
                                    </Grid>
                                </Card>
                            </Grid>
                            <Grid container item xs={8} className="GiveFlex ReviewPanelContainer ExtraPaddingBottom"
                                direction="column">
                                <Grid container item className="GiveFlex" direction="column">
                                    <Grid item className="GiveFlex">
                                        <Paper className="ReviewTab">
                                            <Typography className="BioBoldedText">
                                                Reviews From Previous Tutors
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    {displayedProfile.student_reviews?.length === 0
                                        ?
                                            <h2>No Reviews.</h2>
                                        :
                                            <>
                                                {
                                                    displayedProfile.student_reviews?.map(student_review => {
                                                        return (
                                                            <Grid key={uid(student_review)} container item className="GiveFlex">
                                                                <Grid container item xs={2} className="GiveFlex ReviewContainer"
                                                                    direction="column" alignItems="center" justifyContent="center">
                                                                    <ProfilePic account={{username: student_review.reviewer, picture: student_review.profile.picture}}
                                                                                className={"ReviewerProfilePicture"} variant={"circular"}/>
                                                                    <Rating
                                                                        readOnly
                                                                        value={student_review.rating}
                                                                        precision={0.2}
                                                                        size="large"
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={8} className="GiveFlex ReviewContainer">
                                                                    <Input
                                                                        multiline
                                                                        fullWidth
                                                                        readOnly
                                                                        disableUnderline={true}
                                                                        value={student_review.description}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        );
                                                    })
                                                }
                                            </>
                                    }
                                </Grid>
                                <Grid container item className="GiveFlex MarginUpDownFive" direction="column">
                                    <Grid item className="GiveFlex">
                                        <Paper className="ReviewTab">
                                            <Typography className="BioBoldedText">
                                                Reviews From Previous Students
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    {displayedProfile.tutor_reviews?.length === 0
                                        ?
                                            <h2>No Reviews.</h2>
                                        :
                                            <>
                                                {
                                                    displayedProfile.tutor_reviews?.map(tutor_review => {
                                                        return (
                                                            <Grid key={uid(tutor_review)} container item className="GiveFlex">
                                                                <Grid container item xs={2} className="GiveFlex ReviewContainer"
                                                                    direction="column" alignItems="center" justifyContent="center">
                                                                    <ProfilePic account={{username: tutor_review.reviewer, picture: tutor_review.profile.picture}}
                                                                                className={"ReviewerProfilePicture"} variant={"circular"}/>
                                                                    <Rating
                                                                        readOnly
                                                                        value={tutor_review.rating}
                                                                        precision={0.2}
                                                                        size="large"
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={8} className="GiveFlex ReviewContainer">
                                                                    <Input
                                                                        multiline
                                                                        fullWidth
                                                                        readOnly
                                                                        disableUnderline={true}
                                                                        value={tutor_review.description}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        );
                                                    })
                                                }
                                            </>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
            }
        </>
        
    );
};

export default MyProfile;
