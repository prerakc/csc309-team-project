import "./styles.css";

import React, {useContext, useState} from "react";
import Card from "@mui/material/Card";
import {uid} from "react-uid";

import Chip from "@mui/material/Chip";
import tutoricon from "../../resources/chalkboard-user-solid.svg";
import studenticon from "../../resources/graduation-cap-solid.svg";
import Button from "@mui/material/Button";
import {ListingsContext} from "../../context/ListingsContext";
import ProfilePic from "../../profile/ProfilePic";
import Rating from "@mui/material/Rating";
import { Grid, Typography } from "@mui/material";

import ConfirmDialog from "../../confirm/ConfirmDialog";

export const Reports = () => {
    const {listings, deleteListing, unreportListing} = useContext(ListingsContext);

    const reportedListings = listings.filter(listing => listing.report.isreported === true)

    function useTriggerRender(){
        const [value, setValue] = useState(0);
        return () => setValue(value => value + 1);
    }

    const triggerRender = useTriggerRender();

    const [deleteDialogOpen, setdeleteDialogOpen] = React.useState(false);
    const [selectedListing, setselectedListing] = React.useState(null);

    const handleDelete = (index) => {
        setselectedListing(index)
        setdeleteDialogOpen(true)
    }

    const confirmDelete = (rtnval) => {
        setdeleteDialogOpen(false)
        if (rtnval) {
            deleteListing(selectedListing)
        }
        setselectedListing(null)
    }

    return (
        <>
            <div>
                <h1 className="MarginTopFromNavBar MarginLeftFromContainer">Reports</h1>
                <Grid container direction="column" className="ReportListingsView">
                    {
                        reportedListings.map(listing => {
                            return (
                                <Grid item className="MarginLeftFromContainer" key={uid(listing)}>
                                    <Card className="ReportListing">
                                        <div className="ReportCardContainer">
                                            <div className="ReportListingProfileContainer">
                                                {listing?.createdBy ? <ProfilePic account={{username: listing.createdBy, picture: listing.profilePic}} className={"ReportListingProfilePic"} variant={"circle"}/> : null}
                                                <p className="ReportCreatedByLabel">{listing?.fullname}</p>
                                                <p className="ReportCreatedByLabel">{listing?.istutor ? "Tutor" : "Student"}</p>
                                                <div className="ReportRatingContainer">
                                                    <Rating
                                                        readOnly
                                                        value={listing?.rating}
                                                        precision={0.2}
                                                    />
                                                </div>
                                            </div>
                                            <div className="ReportCardContent">
                                                <div>
                                                    <div className="ReportlistingHeader">
                                                        <div className="ReportlistingPrice">{`$${listing?.price}`}</div>
                                                        <span className="ReportlistingTitle">{listing?.title}</span>
                                                    </div>
                                                    <span className="ReportlistingDate">{listing?.date.toISOString().split('T')[0]}</span>
                                                </div>
                                                <p>{listing?.description}</p>
                                                <div className="ReportSubjectsContainer">
                                                    {listing?.subjects?.map((subject, index) => (
                                                        <Chip
                                                            key={uid(subject, index)}
                                                            label={subject}
                                                            className="ReportSubjectTag"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <img
                                                src={listing?.istutor ? tutoricon : studenticon}
                                                className="ReportListingTypeIcon"
                                                alt="Listing Type"
                                            />
                                        </div>
                                        
                                        <div className="ReportDeleteButtonContainer">
                                            <Button
                                                variant="contained"
                                                onClick={() => handleDelete(listings.indexOf(listing))}
                                            >
                                                Delete Post
                                            </Button>
                                        </div>
                                        <div style={{paddingRight: 20}} className="ReportReportButtonContainer">
                                            <Typography
                                                className="ReportText"
                                                variant="button"
                                            > Reported for {listing.report.description} by {listing.report.by === null ? "DELETED USER" : listing.report.by}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Button
                                                    variant="contained"
                                                    onClick={() => {
                                                        unreportListing(listings.indexOf(listing))
                                                        triggerRender()
                                                    }}
                                            > Unreport Post   
                                            </Button>
                                        </div>
                                    </Card>
                                    
                                </Grid>
                            );
                        })
                    }
                </Grid>
                <ConfirmDialog titleText="Confirm Deletion" bodyText={`Are you sure you want to delete the listing: ${listings[selectedListing]?.title}`} open={deleteDialogOpen} callback={confirmDelete}/>              
            </div>
        </>);
};

export default Reports;