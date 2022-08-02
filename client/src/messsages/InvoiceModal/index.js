import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import React, {useCallback, useContext, useState} from "react";
import Button from "@mui/material/Button";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from "@mui/material/TextField";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";

import "./styles.css"
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import {MessageContext} from "../../context/MessageContext";
import {AccountContext} from "../../context/AccountContext";

export const InvoiceModal = props => {

    const {profile} = useContext(AccountContext);

    const {addInvoice} = useContext(MessageContext);

    const [date, setDate] = useState(new Date());
    const handleDateChange = newDate => {
        setDate(newDate);
    };

    const [time, setTime] = useState(new Date());
    const handleTimeChange = newTime => {
        setTime(newTime);
    };

    const [locationError, setLocationError] = useState(false);
    const [location, setLocation] = useState("");
    const handleLocationChange = event => {
        const input = event.target.value;
        if (input !== "")
            setLocationError(false);

        setLocation(input);
    };

    const [priceError, setPriceError] = useState(false);
    const [priceErrorDescription, setPriceErrorDescription] = useState("");
    const [price, setPrice] = useState("");
    const handlePriceChange = event => {
        const input = event.target.value;

        if (!/^[0-9]+$/.test(input)) {
            setPriceError(true);
            setPriceErrorDescription("Price must be numeric");
        } else {
            setPrice(input);
            setPriceError(false);
        }
    };

    const handleSubmit = useCallback(async () => {

        if (location === "") {
            setLocationError(true);
        } else if (price === "") {
            setPriceError(true);
            setPriceErrorDescription("Price must be non-empty");
        } else if (priceError || locationError) {
            alert("Invalid Input");
        } else {

            const result = await addInvoice(props.chat._id, profile.username, date, time, location, price);

            if (!result) {
                alert("You cannot have two open invoices at the same time");
            }

            setDate(new Date());
            setTime(new Date());
            setLocation("");
            setPrice("");
            props.close();
        }
    }, [props, location, price, locationError, priceError, addInvoice, date, profile, time]);

    return (
        <Modal
            open={props.open}
            onClose={props.close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="invoiceModal">
                <div className={"invoiceModalTitleWrapper"}>
                    <h2>Create Invoice</h2>
                </div>
                <div className="element">
                    <div className={"dateTimeSelector"}>
                        <div className={"dateSelector"}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    label="Date"
                                    inputFormat="MM/dd/yyyy"
                                    value={date}
                                    onChange={handleDateChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </div>
                        <div className={"timeSelector"}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                    label="Start Time"
                                    value={time}
                                    onChange={handleTimeChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                </div>
                <div className="element">
                    <TextField
                        error={locationError}
                        helperText={locationError ? "Location Must be non-empty" : false}
                        label="Location"
                        variant="standard"
                        value={location}
                        onChange={handleLocationChange}
                    />
                </div>
                <div className="element">
                    <TextField
                        error={priceError}
                        helperText={priceError ? priceErrorDescription : false}
                        label="Price"
                        variant="standard"
                        value={price}
                        onChange={handlePriceChange}
                    />
                </div>
                <div className="element">
                    <Button variant="contained" onClick={handleSubmit}>
                        Post
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};