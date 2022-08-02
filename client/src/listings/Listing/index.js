import React, {useCallback, useContext, useRef} from "react";
import Card from "@mui/material/Card";
import {uid} from "react-uid";

import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import tutoricon from "../../resources/chalkboard-user-solid.svg";
import studenticon from "../../resources/graduation-cap-solid.svg";
import Button from "@mui/material/Button";
import {ListingsContext} from "../../context/ListingsContext";
import {AccountContext} from "../../context/AccountContext";
import {useFunctionMappedState} from "../../hooks/useFunctionMappedState";
import Popover from '@mui/material/Popover';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ProfilePic from "../../profile/ProfilePic";

// import { useConfirmDialog } from 'react-mui-confirm';

import ConfirmDialog from "../../confirm/ConfirmDialog";


import "./styles.css";

export const Listing = props => {

    const reportPopover = useRef();
    const {listings, deleteListing, reportListing} = useContext(ListingsContext);
    const {profile} = useContext(AccountContext);
    const listing = useFunctionMappedState(useCallback(() => listings[props.index], [listings, props.index]));

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const reasons = [
        {value: 10, desc: "Abuse"},
        {value: 20, desc: "Missed Payment"},
        {value: 30, desc: "Profanity/Prejudice"},
    ];
    const [reason, setReason] = React.useState(10);

    const handleReportReason = (event) => {
        setReason(event.target.value);
    };

    const handleReportConfirm = () => {
        const whatreason = reasons.filter((element, index) => element.value === reason)[0];
        reportListing(props.index, profile.username, whatreason.desc);
        handleClose();
    };


    const [deleteDialogOpen, setdeleteDialogOpen] = React.useState(false);

    const handleDelete = (index) => {
        setdeleteDialogOpen(true)
    }

    const confirmDelete = (rtnval) => {
        setdeleteDialogOpen(false)
        if (rtnval) {
            deleteListing(props.index)
        }
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
        <Card className="Listing">
            <div className="CardContainer">
                <div className="ListingProfileContainer">
                    {listing?.createdBy ? <ProfilePic account={{username: listing.createdBy, picture: listing.profilePic}} className={"ListingProfilePic"} variant={"circle"}/> : null}
                    <p className="CreatedByLabel">{listing?.fullname}</p>
                    <p className="CreatedByLabel">{listing?.istutor ? "Tutor" : "Student"}</p>
                    <div className="RatingContainer">
                        <Rating
                            readOnly
                            value={listing?.rating}
                            precision={0.2}
                        />
                    </div>
                </div>
                <div className="CardContent">
                    <div>
                        <div className="listingHeader">
                            <div className="listingPrice">{`$${listing?.price}`}</div>
                            <span className="listingTitle">{listing?.title}</span>
                        </div>
                        <span className="listingDate">{listing?.date.toISOString().split('T')[0]}</span>
                    </div>
                    <p>{listing?.description}</p>
                    <div className="SubjectsContainer">
                        {listing?.subjects?.map((subject, index) => (
                            <Chip
                                key={uid(subject, index)}
                                label={subject}
                                className="SubjectTag"
                            />
                        ))}
                    </div>
                </div>
                <img
                    src={listing?.istutor ? tutoricon : studenticon}
                    className="ListingTypeIcon"
                    alt="Listing Type"
                />
            </div>
            {listing?.createdBy === profile?.username || profile?.type === 'admin' ? (
                    <div className="DeleteButtonContainer">
                        <Button
                            variant="contained"
                            onClick={() => handleDelete(props.index)}
                        >
                            Delete Post
                        </Button>
                    </div>
                ) :
                null}
            {listing?.createdBy !== profile?.username && profile?.type !== 'admin' ? (
                    <div className="ReportButtonContainer">
                        <Button
                            variant="contained"
                            disabled={listing?.report.isreported}
                            onClick={handleClick}
                        >
                            {listing?.report.isreported ? "Already Reported" : "Report Post"}
                        </Button>
                    </div>
                ) :
                null}
            <Popover
                className="ReportPopoverClass"
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                ref={reportPopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div className="ReasonSelect">
                    <FormControl
                        fullWidth>
                        <InputLabel id="demo-simple-select-label">Reason</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={reason}
                            label="reason"
                            onChange={handleReportReason}
                        >
                            {reasons.map((item) => {
                                return <MenuItem key={item.value} value={item.value}>{item.desc}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </div>
                <div className="ConfirmReport">
                    <Button
                        variant="contained"
                        onClick={handleReportConfirm}
                    >
                        confirm
                    </Button>
                </div>
            </Popover>
        </Card>
        <ConfirmDialog titleText="Confirm Deletion" bodyText={`Are you sure you want to delete the listing: ${listing?.title}`} open={deleteDialogOpen} callback={confirmDelete}/>              
        </div>
    );
};