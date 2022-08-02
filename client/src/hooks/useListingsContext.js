import {useCallback, useState} from "react";
import {useFunctionMappedState} from "./useFunctionMappedState";
import ENV from "../config/config";


export const useListingsContext = () => {


    const getAllListingsAPI = async () => {
        const url = `${ENV.api_host}/api/listing`;
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

    const deleteListingAPI = async (listingID) => {
        const url = `${ENV.api_host}/api/listing/${listingID}`;
        const request = new Request(url, {
            method: "DELETE"
        });
        try {
            let res = await fetch(request);
            return res.status === 200
        } catch (error) {
            console.log(error);
            return false
        }
    }

    const createListingAPI = async(listing) => {
        const url = `${ENV.api_host}/api/listing`;
        const request = new Request(url, {
            method: "post",
            body: JSON.stringify(listing),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });
        
        try {
            let res = await fetch(request)
            // console.log(res)
            if (res.status === 200) {
                res = await res.json()
                return res
            } else {
                return undefined
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const reportListingAPI = async(listingid, report) => {
        const url = `${ENV.api_host}/api/listing/report/${listingid}`;
        const request = new Request(url, {
            method: "post",
            body: JSON.stringify(report),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });
        
        try {
            let res = await fetch(request)
            // console.log(res)
            if (res.status === 200) {
                res = await res.json()
                return res
            } else {
                return undefined
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const deleteReportAPI = async (listingID) => {
        const url = `${ENV.api_host}/api/listing/report/${listingID}`;
        const request = new Request(url, {
            method: "DELETE"
        });
        try {
            let res = await fetch(request);
            return res.status === 200
        } catch (error) {
            console.log(error);
            return false
        }
    }    


    const [listings, setListings] = useState([]);//useState(hardcoded_listings);

    const addListing = useCallback((listing) => {
        setListings(existingListings => {
            return [
                ...existingListings,
                {
                    title: listing.title,
                    createdBy: listing.createdBy,
                    profilePic: listing.profilePic,
                    description: listing.description,
                    subjects: listing.subjects,
                    istutor: listing.istutor,
                    rating: listing.rating,
                    price: listing.price,
                    date: listing.date,
                    report: {
                        isreported: false,
                        by: "",
                        description: ""
                    },
                    fullname: listing.fullname,
                    _id: listing._id
                }
            ]
        })
        //set filters and sorting so new post is on top
        setFilters((existingFilters) => {
            return {
                rating: 0,
                student: true,
                tutor: true,
                subjects: [], // ["Yelling"],
                price_high: Math.max(listing.price, existingFilters.price_high),
                price_low: 0,
                dates: [null, null]
            }
        })
        setSort(() => {
            return {
                ascending: 'descending',
                property: 'date'
            }
        })

    }, [setListings]);

    const deleteListing = useCallback( (indexToDelete) => {
        setListings(existingListings => {
            const deleted = deleteListingAPI(existingListings[indexToDelete]._id)
            if (deleted) {
                return existingListings.filter((element, index) => index !== indexToDelete)
            } else {
                return existingListings
            }
        } )
    }, [setListings]);

    const deleteUserListings = useCallback((username) => {
        setListings(existingListings => {
            const userslistings = existingListings.filter(listing => listing.createdBy === username)
            userslistings.map((listing) => {
                deleteListingAPI(listing._id)
            })
            return existingListings.filter(listing => listing.createdBy !== username)
       })
    }, [setListings]);

    const addReply = useCallback((listingsIndex, name, response) =>
            setListings(existingListings => {
                return existingListings.map((element, index) =>
                    index === listingsIndex ?
                        {
                            ...element,
                            replies: [
                                ...(element.replies ? element.replies : []),
                                {
                                    name: name,
                                    response: response
                                }
                            ]
                        }
                        : element)
            })
        , [setListings]);

    const [filters, setFilters] = useState({
        rating: 0,
        student: true,
        tutor: true,
        subjects: [],
        price_high: 1500,
        price_low: 0,
        dates: [null, null]
    });

    const updateSeeking = useCallback((tutor, status) =>
            setFilters(existingFilters => {
                if (tutor) {
                    return {
                        ...existingFilters,
                        tutor: status
                    };
                } else {
                    return {
                        ...existingFilters,
                        student: status
                    };
                }
            })
        , [setFilters]);

    const updateFilterSubjects = useCallback(subjects =>
            setFilters(existingFilters => (
                {
                    ...existingFilters,
                    subjects: subjects
                }
            ))
        , [setFilters]);

    const updatePrice = useCallback((low, high) =>
            setFilters(existingFilters => (
                {
                    ...existingFilters,
                    price_low: Math.max(low, 0),
                    price_high: Math.min(high, 10000)
                }
            ))
        , [setFilters]);

    const updateDates = useCallback((dates) =>
            setFilters(existingFilters => (
                {
                    ...existingFilters,
                    dates: dates
                }
            ))
        , [setFilters]);

    const updateRating = useCallback((rating) =>
            setFilters(existingFilters => (
                {
                    ...existingFilters,
                    rating: rating
                }
            ))
        , [setFilters]);

    const [sort, setSort] = useState({
        ascending: 'descending',
        property: "rating"
    });

    const updateSortDirection = useCallback(ascending =>
            setSort(sort => (
                {
                    ...sort,
                    ascending: ascending
                }
            ))
        , [setSort]);

    const updateSortProperty = useCallback(property =>
            setSort(sort => (
                {
                    ...sort,
                    property: property
                }
            ))
        , [setSort]);

    const reportListing = useCallback((indextoreport, deletedby, description) => {
        setListings((existingListings) => {
            const reportedListing = existingListings.filter((element, index) => index === indextoreport)[0]
            const report = {by: deletedby, description: description, isreported: true}

            if (reportListingAPI(existingListings[indextoreport]._id, report)) {
                reportedListing.report = report
                return existingListings
            }

            return existingListings
        })
    }, [setListings]);

    const unreportListing = useCallback((reportedIndex) => {
        setListings((existingListings) => {
            const reportedListing = existingListings.filter((element, index) => index === reportedIndex)[0]
            
            if (deleteReportAPI(existingListings[reportedIndex]._id)) {
                reportedListing.report = {by: "", description: "", isreported: false};
                return existingListings
            }

            return existingListings
        })
    }, [setListings]);

    const subjects = useFunctionMappedState(useCallback(() => {
        const allsubjects = new Set();
        listings.forEach((listing) => {
            // console.log(listing)
            listing.subjects.forEach((subject) => {
                allsubjects.add(subject);
            });
        });
        return Array.from(allsubjects);
    }, [listings]));

    const maxPrice = useFunctionMappedState(useCallback(() => {
        const max = Math.max.apply(
            Math,
            listings.map((ele) => ele.price)
        );

        if (filters.price_high > max) {
            updatePrice(filters.price_low, max);
        }

        return max;
    }, [listings, filters, updatePrice]));

    return {
        listings,
        subjects,
        maxPrice,
        addListing,
        deleteListing,
        deleteUserListings,
        reportListing,
        unreportListing,
        addReply,
        filters,
        setFilters,
        updateSeeking,
        updateFilterSubjects,
        updatePrice,
        updateDates,
        updateRating,
        sort,
        updateSortDirection,
        updateSortProperty,
        setListings,
        getAllListingsAPI,
        deleteListingAPI,
        createListingAPI
    };
};