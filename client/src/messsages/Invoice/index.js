import "./styles.css"
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import Button from "@mui/material/Button";
import React, {useCallback, useContext, useState} from "react";
import createTheme from "@mui/material/styles/createTheme";
import {MessageContext} from "../../context/MessageContext";
import {ReviewModal} from "../ReviewModal";

const green = createTheme({
    palette: {
        primary: {
            main: "#64dd17"
        }
    },
});

const red = createTheme({
    palette: {
        primary: {
            main: "#d50000"
        }
    },
});

export const Invoice = props => {

    const {withDrawInvoice, acceptInvoice, rejectInvoice} = useContext(MessageContext);

    const handleAccept = useCallback(() => acceptInvoice(props.chat._id), [acceptInvoice, props]);

    const handleReject = useCallback(() => rejectInvoice(props.chat._id), [rejectInvoice, props]);

    const handleWithDraw = useCallback(() => withDrawInvoice(props.chat._id), [withDrawInvoice, props]);

    const [showReview, setShowReview] = useState(false);

    const handleReview = () => setShowReview(true);

    const closeReview = () => setShowReview(false);

    const invoiceRequest = useCallback(() => {
        return (
            <>
                <div className={"invoiceHeader"}>
                    <h3>Invoice Request</h3>
                </div>
                <List>
                    <ListItemText>
                        <strong>Date:</strong> {new Date(props.invoice.invoice_data.date).toLocaleDateString()}
                    </ListItemText>
                    <ListItemText>
                        <strong>Time:</strong> {new Date(props.invoice.invoice_data.time).toLocaleTimeString()}
                    </ListItemText>
                    <ListItemText>
                        <strong>Location:</strong> {props.invoice.invoice_data.location}
                    </ListItemText>
                    <ListItemText>
                        <strong>Price:</strong> ${props.invoice.invoice_data.price}
                    </ListItemText>
                </List>
                {
                    props.sender ?
                        <div className={"invoiceResponse"}>
                            <div>
                                <ThemeProvider theme={green}>
                                    <Button variant="contained" onClick={handleAccept}>
                                        Accept
                                    </Button>
                                </ThemeProvider>
                            </div>
                            <div>
                                <ThemeProvider theme={red}>
                                    <Button variant="contained" onClick={handleReject}>
                                        Reject
                                    </Button>
                                </ThemeProvider>
                            </div>
                        </div>
                        :
                        <ThemeProvider theme={red}>
                            <Button variant="contained" onClick={handleWithDraw}>
                                Withdraw
                            </Button>
                        </ThemeProvider>

                }
            </>
        )
    }, [props, handleAccept, handleReject, handleWithDraw]);

    const invoiceRejected = () =>
        <>
            <div className={"invoiceHeader"}>
                <h3>Invoice Rejected</h3>
            </div>
        </>;

    const invoiceWithdrew = () =>
        <>
            <div className={"invoiceHeader"}>
                <h3>Invoice Withdrew</h3>
            </div>
        </>;

    const invoiceAccepted = () =>
        <>
            <div className={"invoiceHeader"}>
                <h3>Invoice Accepted</h3>
            </div>
            <div className={"submitReview"}>
                <Button variant="contained" onClick={handleReview}>
                    Submit Review
                </Button>
            </div>
        </>;
    const reviewSubmitted = () =>
        <>
            <div className={"invoiceHeader"}>
                <h3>Review Submitted</h3>
            </div>
        </>;
    const reviewClosed = () =>
        <>
            <div className={"invoiceHeader"}>
                <h3>Review Closed</h3>
            </div>
        </>;

    const computeVisual = () => {
        switch (props.invoice.status) {
            case -2:
                return invoiceRejected();
            case -1:
                return invoiceWithdrew();
            case 0:
                return invoiceRequest();
            case 1:
                return invoiceAccepted();
            case 2:
                return props.invoice.invoice_data.waiting === props.user.username ? invoiceAccepted() : reviewSubmitted();
            case 3:
                return reviewClosed();
            default:
                return <p>Unexpected Error</p>
        }
    };

    return (
        <>
            {computeVisual()}
            <ReviewModal open={showReview} close={closeReview} chat={props.chat} reviewer={props.user} reviewee={props.other}
                         tutor={props.sender}/>
        </>
    )
};