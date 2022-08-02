import "./styles.css";

import React, {useContext, useCallback, useState, useEffect} from "react";
import {uid} from "react-uid";

import {AccountContext} from "../../context/AccountContext";
import {ListingsContext} from "../../context/ListingsContext";
import ProfilePic from "../ProfilePic";
import {LoginCheck} from "../../logincheck";
import { WrapNavBarAndFooter } from "../../common/wrapper";


import {Typography} from "@mui/material";
import Card from "@mui/material/Card";
import {Input} from '@mui/material';
import {Grid} from "@mui/material";
import Rating from '@mui/material/Rating'
import Divider from '@mui/material/Divider';
import Button from "@mui/material/Button";

import ConfirmDialog from "../../confirm/ConfirmDialog";

export const AllProfiles = () => {
    const {profile, getAllProfiles, modifyPrivileges_API, remove_API} = useContext(AccountContext);
    const {deleteUserListings} = useContext(ListingsContext);

    const [profiles, setProfiles] = useState([])

    const fetchData = useCallback(async () => {
        try {
            const data = await getAllProfiles()

            if (!(data?.constructor === Object && Object.keys(data).length === 0)) {
                setProfiles(data)
            }
            
        } catch (error) {
            console.log(error)
        }
    }, [getAllProfiles, setProfiles])

    useEffect(() => {
        fetchData()
    }, [])

    const handlePrivilegeChange_API = useCallback((username, type) => {
        const valid = modifyPrivileges_API(username, type);

        if (!valid) {
            alert(`Cannot find User with ID ${username}`);
        } else {
            const newProfiles = JSON.parse(JSON.stringify(profiles))
            newProfiles.filter(p => p.username === username)[0].type = type
            setProfiles(newProfiles)
        }
    }, [modifyPrivileges_API, profiles, setProfiles]);

    const handleDelete_API = useCallback((username) => {
        deleteUserListings(username)
        const valid = remove_API(username);

        if (!valid) {
            alert(`Cannot find User with ID ${username}`);
        }

        setProfiles(oldProfiles => oldProfiles.filter(p => p.username !== username))
    }, [deleteUserListings, remove_API, setProfiles]);

    const [deleteDialogOpen, setdeleteDialogOpen] = React.useState(false);
    const [usertodelete, setusertodelete] = React.useState(null);

    const handleDelete = (username) => {
        setusertodelete(username)
        setdeleteDialogOpen(true)
    }

    const confirmDelete = (rtnval) => {
        setdeleteDialogOpen(false)
        if (rtnval) {
            handleDelete_API(usertodelete)
        }
        setusertodelete(null)
    }

    return (
        <>
            <LoginCheck>
                <WrapNavBarAndFooter>
                    <div id="profileList">
                        {profiles.map((p) => {
                            return (
                                <div key={uid(p)}>
                                    <Card>
                                        <Grid container>
                                            <Grid container item xs={2} className="GiveFlex" direction="column"
                                                    alignItems="center" justifyContent="center">
                                                <ProfilePic account={{username: p.username, picture: p.picture}} className={"ProfilePicture"} variant={"circular"}/>
                                                {
                                                    profile.type === "admin"
                                                        ?
                                                        <>
                                                            <Button id="DeleteUser" variant="contained"
                                                                    onClick={() => handleDelete(p.username)}>Delete
                                                                User</Button>
                                                        </>
                                                        :
                                                        null
                                                }
                                            </Grid>
                                            <Grid container item xs={10} className="GiveFlex" direction="column"
                                                    spacing={2} alignItems="center" justifyContent="center">
                                                <Grid container item spacing={2}>
                                                    <Grid item xs={3}>
                                                        <Typography
                                                            className="BoldedText"
                                                        > User ID:
                                                        </Typography>
                                                        &nbsp;
                                                        <Input
                                                            readOnly
                                                            disableUnderline
                                                            value={p.username}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography
                                                            className="BoldedText"
                                                        > Student Rating:
                                                        </Typography>
                                                        <br/>
                                                        <Rating
                                                            readOnly
                                                            name="student"
                                                            value={p.student_rating}
                                                            precision={0.2}
                                                            size="large"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography
                                                            className="BoldedText"
                                                        > Tutor Rating:
                                                        </Typography>
                                                        <br/>
                                                        <Rating
                                                            readOnly
                                                            name="tutor"
                                                            value={p.tutor_rating}
                                                            precision={0.2}
                                                            size="large"
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid container item spacing={2}>
                                                    <Grid item xs={3}>
                                                        <Typography
                                                            className="BoldedText"
                                                        > Name:
                                                        </Typography>
                                                        &nbsp;
                                                        <Input
                                                            readOnly
                                                            disableUnderline
                                                            value={p.name}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography
                                                            className="BoldedText"
                                                        > Email:
                                                        </Typography>
                                                        &nbsp;
                                                        <Input
                                                            readOnly
                                                            disableUnderline
                                                            value={p.email}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography
                                                            className="BoldedText"
                                                        > Phone:
                                                        </Typography>
                                                        &nbsp;
                                                        <Input
                                                            readOnly
                                                            disableUnderline
                                                            value={p.phone}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid container item spacing={2}>
                                                    <Grid item xs={9}>
                                                        <Typography
                                                            className="BoldedText"
                                                        > Description:
                                                        </Typography>
                                                        <Input
                                                            multiline
                                                            fullWidth
                                                            readOnly
                                                            disableUnderline
                                                            value={p.description}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid container item spacing={2}>
                                                    <Grid item xs={2}>
                                                        <Typography
                                                            className="BoldedText"
                                                        > Type:
                                                        </Typography>
                                                        &nbsp;
                                                        <Input
                                                            readOnly
                                                            disableUnderline
                                                            value={p.type}
                                                        />
                                                    </Grid>
                                                    {
                                                        profile.type === "admin"
                                                            ?
                                                            <>
                                                                <Grid item>
                                                                    <Button variant="contained"
                                                                            onClick={() => handlePrivilegeChange_API(p.username, "admin")}>Grant
                                                                        Admin</Button>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Button variant="contained"
                                                                            onClick={() => handlePrivilegeChange_API(p.username, "user")}>Revoke
                                                                        Admin</Button>
                                                                </Grid>
                                                            </>
                                                            :
                                                            null
                                                    }

                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                    <Divider/>
                                </div>
                            );
                        })}
                    </div>
                </WrapNavBarAndFooter>
            </LoginCheck>
            <ConfirmDialog titleText="Confirm Deletion" bodyText={`Are you sure you want to delete the user: ${usertodelete}`} open={deleteDialogOpen} callback={confirmDelete}/>
        </>
    );
};

export default AllProfiles;
