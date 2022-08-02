import React, {useCallback, useContext, useState, useEffect} from "react";
import {Listing} from "../Listing";
import {ListingsContext} from "../../context/ListingsContext";
import {AccountContext} from "../../context/AccountContext";
import {ListingBar} from "../ListingBar";
import {useFunctionMappedState} from "../../hooks/useFunctionMappedState";
import {CreatePost} from "../CreatePost";
import {WrapNavBarAndFooter} from "../../common/wrapper";
import {LoginCheck} from "../../logincheck";
import "./styles.css"

export const ListingView = () => {

    const {listings, filters, sort, setListings, getAllListingsAPI, setFilters} = useContext(ListingsContext);
    const {getAllProfiles} = useContext(AccountContext);
    
    const fetchData = async () => {
        try {
            const data = await getAllListingsAPI()

            if (data?.constructor === Object && Object.keys(data).length === 0) {
                return;
            }

            const profiles = await getAllProfiles()
            if ((profiles?.constructor === Object && Object.keys(profiles).length === 0)) {
                return 
            }
            if (!profiles) {
                return
            }
            data.map((listing) => {
                const profile = profiles.filter(p => p.username === listing.createdBy)[0]
                listing.date = new Date(listing.date)
                let rating_type = ""
                if (listing.istutor) {
                    rating_type = "tutor_rating"
                } else {
                    rating_type = "student_rating"
                }
                listing.rating = profile[rating_type]//fetchProfileNoPassword(listing.createdBy)?.profile[rating_type]
                listing.fullname = profile.name
                listing.profilePic = profile.picture
            })

            setListings(data)
            const maxprice = Math.max.apply(Math, data.map(function(o) { return o.price; }));
            setFilters((existingFilters) => {
                return {
                    rating: 0,
                    student: true,
                    tutor: true,
                    subjects: [], // ["Yelling"],
                    price_high: Math.max(maxprice, existingFilters.price_high),
                    price_low: 0,
                    dates: [null, null]
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const displayedListings = useFunctionMappedState(useCallback(() => {
        const filteredListings = listings.filter((listing) => {
            const rated = listing.rating >= filters.rating;
            const seeking =
                (listing.istutor && filters.tutor) ||
                (!listing.istutor && filters.student);
            const relevant =
                filters.subjects.length === 0 ||
                listing.subjects.some((element1) =>
                    filters.subjects.some((element2) => element2 === element1)
                );
            const cost =
                filters.price_high >= listing.price &&
                filters.price_low <= listing.price;
            const indaterange =
                ((filters.dates[1] >= listing.date) || (filters.dates[1] === null)) &&
                ((filters.dates[0] <= listing.date) || (filters.dates[0] === null));
            return rated && seeking && relevant && cost && indaterange;
        });

        const sortedListings = filteredListings.sort((a, b) => {
            return a[sort.property] > b[sort.property] ? ((sort.ascending === 'ascending') * 2 - 1) : -1 * ((sort.ascending === 'ascending') * 2 - 1)
        });

        const temp = [];
        for (const [key, value] of sortedListings.entries()) {
            temp.push(<Listing key={key} index={listings.indexOf(value)}/>)
        }
        return temp;
    }, [listings, filters, sort]));

    const [createNew, setCreateNew] = useState(false);

    const showCreateNew = () => setCreateNew(true);

    const closeCreateNew = () => setCreateNew(false);

    return (
        <LoginCheck>
            <WrapNavBarAndFooter>
                <div className="listingsView">
                    <div className="listingsBar">
                        <ListingBar
                            createListing={showCreateNew}
                        />
                    </div>
                    <div className="listingsWindow">
                        {displayedListings}
                    </div>
                    <CreatePost
                        open={createNew}
                        close={closeCreateNew}
                    />
                </div>
            </WrapNavBarAndFooter>
        </LoginCheck>
    );
};