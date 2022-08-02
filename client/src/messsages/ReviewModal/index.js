import React, {useCallback, useContext, useState} from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import "./styles.css"
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {MessageContext} from "../../context/MessageContext";

export const ReviewModal = (props) => {

    const {postReview} = useContext(MessageContext);

    const [rating, setRating] = useState(0);

    const handleRatingChange = (event) => setRating(parseInt(event.target.value));

    const [review, setReview] = useState("");

    const handleReviewChange = (event) => setReview(event.target.value);

    const handleSubmit = useCallback(() => {
        postReview(props.chat._id, props.reviewee.username, props.tutor ? "tutor" : "student", props.reviewer.username, rating, review);
        setRating(0);
        setReview("");
        props.close();
    }, [postReview, props, rating, review]);

    return (
        <Modal
            open={props.open}
            onClose={props.close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="reviewModal">
                <div className={"reviewModalTitleWrapper"}>
                    <h2>Review Of {props.reviewee.name}</h2>
                </div>
                <div className={"reviewModalInput"}>
                    <div className={"reviewModalInputWrapper"}>
                        <Rating
                            value={rating}
                            precision={0.5}
                            size="large"
                            onChange={handleRatingChange}
                        />
                    </div>
                </div>
                <div className={"reviewModalInput"}>
                    <div className={"reviewModalInputWrapper"}>
                        <TextField
                            id="outlined-multiline-static"
                            multiline
                            rows={6}
                            label="Review"
                            value={review}
                            placeholder={"Provide any comments about " + props.reviewee.name}
                            className="description-field"
                            fullWidth
                            name="description"
                            onChange={handleReviewChange}
                        />
                    </div>
                </div>
                <div className={"reviewModalInput"}>
                    <div className={"reviewModalInputWrapper"}>
                        <Button variant="contained" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};