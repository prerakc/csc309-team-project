import React, {useCallback, useContext} from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDateRangePicker from "@mui/lab/DesktopDateRangePicker";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import {uid} from "react-uid";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import {ListingsContext} from "../../context/ListingsContext";
import "./styles.css"

export const ListingBar = props => {

    const {sort, subjects, maxPrice, filters, setFilters, updateSeeking, updateFilterSubjects, updatePrice, updateDates, updateRating, updateSortDirection, updateSortProperty} = useContext(ListingsContext);
    const {listings} = useContext(ListingsContext);


    const handleSeekingChange = useCallback(event => {
        const status = event.target.checked;
        if (event.target.name === "tutorcheckbox") {
            updateSeeking(true, status);
        } else if (event.target.name === "studentcheckbox") {
            updateSeeking(false, status);
        }
    }, [updateSeeking]);

    const handleFilterChange = useCallback(event => {
        const value = event.target.value;
        const subjects = typeof value === "string" ? value.split(",") : value;
        updateFilterSubjects(subjects);
    }, [updateFilterSubjects]);

    const handlePriceChange = useCallback((event, value) =>
            updatePrice(value[0], value[1])
        , [updatePrice]);

    const handleDatesChange = useCallback((value) => updateDates(value), [updateDates]);

    const handleRatingChange = useCallback((value) => updateRating(value), [updateRating]);

    const handleSortDirectionChange = useCallback(event => updateSortDirection(event.target.value), [updateSortDirection]);

    const handleSortPropertyChange = useCallback(event => updateSortProperty(event.target.value), [updateSortProperty]);

    const handleFilterReset = useCallback(() => setFilters({
        rating: 0,
        student: true,
        tutor: true,
        subjects: [],
        price_high: maxPrice,
        price_low: 0,
        dates: [null, null]
    }), [setFilters, maxPrice])

    return (
        <div className="listingssidebar">
            {listings.length >= 1 ? <div>
                <div className="Filters">
                    <FormControl className="ControlGroup">
                        <span className="ControlGroupTitle">Filter</span>
                        <div className="typefilter">
                            <div>
                                <FormControlLabel
                                    label="Tutors"
                                    control={
                                        <Checkbox
                                            name="tutorcheckbox"
                                            checked={filters.tutor}
                                            onChange={handleSeekingChange}
                                        />
                                    }
                                />
                            </div>
                            <div>
                                <FormControlLabel
                                    label="Students"
                                    control={
                                        <Checkbox
                                            name="studentcheckbox"
                                            checked={filters.student}
                                            onChange={handleSeekingChange}
                                        />
                                    }
                                />
                            </div>
                        </div>
                        <div className="subjectfilter">
                            <FormControl className="subjectFilter2">
                                <InputLabel id="demo-multiple-chip-label">Subjects</InputLabel>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    value={filters.subjects}
                                    onChange={handleFilterChange}
                                    fullWidth
                                    input={<OutlinedInput id="select-multiple-chip" label="Subjects"/>}
                                    renderValue={(selected) => (
                                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value}/>
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {subjects.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="controlbox">
                            <p className="controlLabel">Price:</p>
                            <div className="sliderContainer">
                                <Slider
                                    className="slider"
                                    // sx={{width: 200}}
                                    value={[
                                        filters.price_low,
                                        filters.price_high
                                    ]}
                                    onChange={handlePriceChange}
                                    valueLabelDisplay="auto"
                                    max={maxPrice}
                                    marks={[{
                                        value: filters.price_low,
                                        label: `$${filters.price_low}`
                                    }, {value: filters.price_high, label: `$${filters.price_high}`}]}
                                />
                            </div>
                        </div>
                        <div className="controlbox">
                            <div className="controlLabel">
                                Date:{" "}
                            </div>
                            <div className="DateSelector">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DesktopDateRangePicker
                                        className="Filter"
                                        startText="start"
                                        value={filters.dates}
                                        onChange={handleDatesChange}
                                        renderInput={(startProps, endProps) => (
                                            <React.Fragment>
                                                <TextField {...startProps} />
                                                <Box sx={{mx: 2}}> to </Box>
                                                <TextField {...endProps} />
                                            </React.Fragment>
                                        )}
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>
                        <div className="controlbox">
                            <span className="controlLabel">Rating: </span>
                            {[1, 2, 3, 4, 5].map((rating, index) =>
                                filters.rating >= rating ? (
                                    <StarIcon
                                        key={uid(rating, index)}
                                        className="star gold"
                                        onClick={() => handleRatingChange(rating)}
                                    />
                                ) : (
                                    <StarIcon
                                        key={uid(rating, index)}
                                        className="star"
                                        onClick={() => handleRatingChange(rating)}
                                    />
                                )
                            )}
                        </div>
                        <div className="clearFilterContainer">
                            <Button
                                variant="contained"
                                size="small"
                                onClick={handleFilterReset}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </FormControl>
                </div>
                <div className="Filters">
                    <FormControl className="ControlGroup">
                        <span className="ControlGroupTitle">Sort</span>
                        <div className="sortflex">
                            <div className="sortgroup">
                                <RadioGroup
                                    className=""
                                    id="sort-direction-control"
                                    defaultValue="ascending"
                                    name="sortDirection"
                                    value={sort.ascending}
                                    row
                                    onChange={handleSortDirectionChange}>
                                    <FormControlLabel
                                        value="ascending"
                                        control={<Radio/>}
                                        label="ascending"/>
                                    <FormControlLabel
                                        value="descending"
                                        control={<Radio/>}
                                        label="descending"/>
                                </RadioGroup>
                            </div>
                            <div className="sortgroup">
                                <RadioGroup
                                    id="sort-property-control"
                                    defaultValue="rating"
                                    name="sortProperty"
                                    value={sort.property}
                                    onChange={handleSortPropertyChange}
                                    row
                                >
                                    <FormControlLabel
                                        value="rating"
                                        control={<Radio/>}
                                        label="rating"
                                    />
                                    <FormControlLabel value="price" control={<Radio/>} label="price"/>
                                    <FormControlLabel value="date" control={<Radio/>} label="date"/>
                                </RadioGroup>
                            </div>
                        </div>
                    </FormControl>
                </div>
            </div> : null}
            <div className="postButtonClass">
                <Button
                    variant="contained"
                    size="small"
                    onClick={props.createListing}
                >
                    Create post
                </Button>
            </div>
        </div>
    )
};