import React, {useCallback, useContext, useState, useRef} from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";

import {ListingsContext} from "../../context/ListingsContext";
import {AccountContext} from "../../context/AccountContext";

import "./styles.css";

export const CreatePost = props => {

    const titleRef = useRef();
    const descRef = useRef();
    const priceRef = useRef();
    const subjectRef = useRef();

    const {addListing, createListingAPI} = useContext(ListingsContext);
    const {profile} = useContext(AccountContext);

    const [isTutor, setIsTutor] = useState("student");

    const handleTutorChange = useCallback(event => setIsTutor(event.target.value), [setIsTutor]);

    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState(false);
    const [titleErrorText, setTitleErrorText] = useState("");


    const validateTitle = (ref) => {
        let error = true
        if (ref.current.value.length > 60) {
            setTitleErrorText("Max 60 Characters")
        } else if (ref.current.value.length === 0) {
            setTitleErrorText("required")
        } else {
            error = false
            setTitleErrorText("")
        }
        setTitleError(error)
        return !error
    }


    const handleTitleChange = useCallback(event => {
        validateTitle(titleRef)
        setTitle(event.target.value)
    }, [setTitle]);

    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState(false);
    const [descriptionErrorText, setDescriptionErrorText] = useState("");


    const validateDescription = (ref) => {
        let error = true
        const newlinesexp = /(\n.*)/
        if (ref.current.value.length > 300) {
            setDescriptionErrorText("Max 300 Characters")
        } else if (newlinesexp.test(ref.current.value)) {
            setDescriptionErrorText("Single line only")
        } else if (ref.current.value.length === 0) {
            setDescriptionErrorText("required")
        } else {
            error = false;
            setDescriptionErrorText("")
        }
        setDescriptionError(error)
        return !error
    }

    const handleDescriptionChange = useCallback(event => {
        validateDescription(descRef)
        setDescription(event.target.value)
    }, [setDescription]);

    const [price, setPrice] = useState("");
    const [priceError, setPriceError] = useState(false);
    const [priceErrorText, setPriceErrorText] = useState("");


    const validatePrice = (ref) => {
        const numberexp = /^[0-9]+$/
        let error = true
        if (ref.current.value === "") {
            setPriceErrorText("required")
        } else if (!numberexp.test(ref.current.value)) {
            setPriceErrorText("Must be a positive number")
        } else if (parseFloat(ref.current.value) > 10000) {
            setPriceErrorText("Price must be less then $10,000")
        } else {
            error = false
            setPriceErrorText("")
        }
        setPriceError(error)
        return !error
    }
    const handlePriceChange = useCallback(event => {
        validatePrice(priceRef)
        setPrice(event.target.value)
    }, [setPrice]);

    const [subjects, setSubjects] = useState([]);
    const [subjectsError, setSubjectsError] = useState(false);
    const [subjectsErrorText, setSubjectsErrorText] = useState("");

    const validateSubjects = (subjectsState) => {
        let error = true
        if (subjectsState.length === 0) {
            setSubjectsErrorText("required")
        } else if (subjectsState.length > 5) {
            setSubjectsErrorText("No more then 5 subjects")
        } else {
            error = false
            setSubjectsErrorText("")
        }
        setSubjectsError(error)
        return !error
    }

    const handleSubjectsChange = useCallback((event, newValue) => {
        if (subjectRef.current.value.length > 15) {
            setSubjectsError(true)
            setSubjectsErrorText("No more then 15 characters per subject")
        } else {
            setSubjects(newValue)
        }

    }, [setSubjects]);



    // 	title: String
    // 	createdby: String	//username?
    // 	description: String
    //  subjects: List[String]
    // 	istutor: Bool
    // 	price: Float
    // 	date: datetime

    const handleSubmit = useCallback(async () => {
        const titleIsValidated = validateTitle(titleRef)
        const descIsValidated = validateDescription(descRef)
        const priceIsValidated = validatePrice(priceRef)
        const subjectsIsValidated = validateSubjects(subjects)//(subjectRef)
        if (titleIsValidated && descIsValidated && priceIsValidated & subjectsIsValidated) {
            const postRating = isTutor === "tutor" ? profile.tutor_rating : profile.student_rating;
            const listing = await createListingAPI({title: title,
                                            createdBy: profile.username,
                                            description: description,
                                            subjects: subjects,
                                            istutor: isTutor === "tutor",
                                            price: parseFloat(price),
                                            date: new Date(Date.now())}
                                            )
            listing.rating = postRating
            listing.date = new Date(listing.date)
            listing.fullname = profile.name
            listing.profilePic = profile.picture
            // addListing(fullProfile.username, isTutor, title, description, parsefloat(price), subjects, postRating);
            addListing(listing);
            setTitle("")
            setPrice("")
            setSubjects([])
            setDescription("")
            props.close();
        }
    }, [profile, addListing, isTutor, title, description, price, subjects, props]);

    return (
        <Modal
            open={props.open}
            onClose={props.close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="modal-box">
                <div className="create-post-title"><h2>Create Post</h2></div>
                <div className="new-post-field">
                    <FormLabel id="demo-radio-buttons-group-label">I am a:</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="student"
                        name="istutor"
                        value={isTutor}
                        onChange={handleTutorChange}
                        row
                    >
                        <FormControlLabel
                            value="student"
                            control={<Radio/>}
                            label="Student"
                        />
                        <FormControlLabel
                            value="tutor"
                            control={<Radio/>}
                            label="Tutor"
                        />
                    </RadioGroup>
                </div>
                <div className="new-post-field">
                    <TextField
                        inputRef={titleRef}
                        error={titleError}
                        helperText={titleError ? titleErrorText : false}
                        id="post-title"
                        label="Title"
                        variant="standard"
                        className="title-field"
                        fullWidth
                        value={title}
                        onChange={handleTitleChange}
                        name="title"
                    />
                </div>
                <div className="new-post-field">
                    <TextField
                        inputRef={descRef}
                        error={descriptionError}
                        helperText={descriptionError ? descriptionErrorText : false}
                        id="outlined-multiline-static"
                        multiline
                        rows={6}
                        label="Description"
                        value={description}
                        placeholder="Describe your request"
                        className="description-field"
                        fullWidth
                        name="description"
                        onChange={handleDescriptionChange}
                    />
                </div>
                <div className="new-post-field">
                    <TextField
                        inputRef={priceRef}
                        error={priceError}
                        helperText={priceError ? priceErrorText : false}
                        id="NewPrice"
                        label="Price"
                        variant="standard"
                        className="price-field"
                        value={price}
                        onChange={handlePriceChange}
                        name="price"
                    />
                </div>
                <Autocomplete
                    multiple
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    filterSelectedOptions
                    id="free-solo-with-text-demo"
                    options={subjects}
                    className="new-post-field subject-field"
                    value={subjects}
                    freeSolo
                    onChange={handleSubjectsChange}
                    renderInput={(params) => (
                        <TextField
                            inputRef={subjectRef}
                            {...params}
                            label="Subjects"
                            placeholder="Press Enter to Add Subject"
                            error={subjectsError}
                            helperText={subjectsError ? subjectsErrorText : false}
                        />
                    )}
                />
                <div className="new-post-field">
                    <Button variant="contained" onClick={handleSubmit}>
                        Post
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};