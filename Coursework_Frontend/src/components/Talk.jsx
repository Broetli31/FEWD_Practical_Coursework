import Button from 'react-bootstrap/Button'
import TalkDetail from "./TalkDetail.jsx";
import {useEffect, useState} from "react";
import StarRating from "./StarRating.jsx";
import BookmarkIcon from "./BookmarkIcon.jsx";
import styled from "styled-components";
import Alert from "react-bootstrap/Alert";

const CardTitle = styled.h2`
    font-size: 20px;
    flex-grow: 2;
`;

const Card = styled.div`
    max-width: 350px;
    filter: drop-shadow(0 0 6px lightgrey);
    background-color: white;
    border-radius: 15px;
    margin: 20px;
    padding: 10px;

    li {
        list-style: none;
    }
`;

const ButtonArea = styled.div`
    display: flex;
    gap: 10px;
    wrap-option: wrap;
    justify-content: center;
    //margin: 5px 0;
`;

const CardTitleSection = styled.div`
    display: flex;

`;

const Talk = ({talk, canRemove, updateParent}) => {
    const [show, setShow] = useState(false);

    const [bookmarked, setBookmarked] = useState(false);

    const avgRating = talk.ratings.length !== 0 ?
        talk.ratings.reduce((total, rating) => total += rating) / talk.ratings.length : 0;

    const [rating, setRating] = useState({
        value: avgRating,
        isUserRating: false,
    })

    const [showAlert, setShowAlert] = useState(false);

    const handleClose = () => setShow(false);
    const handleOpen = () => setShow(true);

    function getUserRating() {
        const ratingsJson = localStorage.getItem('talk-ratings');
        if (ratingsJson !== null && !rating.isUserRating) {
            const ratings = JSON.parse(ratingsJson);
            const userRating = ratings.filter(rating => rating.talkId === talk.id)[0];
            if (userRating) {
                setRating({
                    value: userRating.value,
                    isUserRating: true,
                })
            }
        }
    }

    function handleRating(newRating) {
        const ratingsJson = localStorage.getItem('talk-ratings');
        let ratings;

        if (ratingsJson !== null) {
            ratings = JSON.parse(ratingsJson);
            ratings = ratings.filter((r) => r.talkId !== talk.id);
            ratings.push({
                talkId: talk.id,
                value: newRating
            })
        } else {
            ratings = [];
            ratings.push({
                talkId: talk.id,
                value: newRating,
            });
        }

        fetch("http://localhost:3001/posts", {
            method: "POST",

            body: new URLSearchParams({
                "talkId": talk.id,
                "rating": newRating,
            }),
        })
            .then((res) => res.text())
            .then(console.log.bind(console))
            .catch(console.error.bind(console));

        localStorage.setItem('talk-ratings', JSON.stringify(ratings));
        setRating({
            value: newRating,
            isUserRating: true,
        });
    }


    function addToItinerary() {
        const talkBrief = {
            id: talk.id,
            time: talk.time,
            speaker: talk.speaker,
        };

        const itineraryJson = localStorage.getItem('itinerary')
        let itinerary = JSON.parse(itineraryJson);

        if (!itinerary || itinerary.length < 1) {
            itinerary = [talkBrief];
            localStorage.setItem('itinerary', JSON.stringify(itinerary));
            return;
        }

        const containsItemAlready = new Set(itinerary).has(talkBrief); // what if the description or anything about the object has changed in the mean time? WE need to figure out a way to use the ID here
        if (containsItemAlready) return;

        // 1. make local storage entry if not exists or just add the element if it's empty.
        // 2. Check if another talk is in that timeslot
        // if there is:
        //      2.1 don't allow to add the talk (alternatively add option to swap)
        //      2.2 show an error message
        // 3. add to itinerary
        // 4. write itinerary to local storage key

        if (itinerary.filter((item) => item.time === talkBrief.time).length > 0) {
            setShowAlert(true)
            setTimeout(() => setShowAlert(false), 10000);
            throw new Error('Timeslot occupied');
        }
        localStorage.setItem('itinerary', JSON.stringify([talkBrief, ...itinerary]));
    }

    function removeFromItinerary() {
        const itineraryJson = localStorage.getItem('itinerary')
        let itinerary = JSON.parse(itineraryJson);

        itinerary = itinerary.filter((item) => item.id !== talk.id);

        localStorage.setItem('itinerary', JSON.stringify(itinerary));
        updateParent()
    }

    function addBookmark() {
        const bookmarksJson = localStorage.getItem('bookmarks');
        const bookmarks = JSON.parse(bookmarksJson) ? JSON.parse(bookmarksJson) : [];

        bookmarks.push(talk.id);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }

    function checkBookmark() {
        const bookmarksJson = localStorage.getItem('bookmarks');
        const bookmarks = JSON.parse(bookmarksJson) ? JSON.parse(bookmarksJson) : [];

        const isBookmarked = bookmarks.includes(talk.id);
        setBookmarked(isBookmarked);
    }

    useEffect(() => {
        checkBookmark();
    }, []);

    function removeBookmark() {
        const bookmarksJson = localStorage.getItem('bookmarks');
        const bookmarks = JSON.parse(bookmarksJson) ? JSON.parse(bookmarksJson) : [];

        bookmarks.splice(bookmarks.indexOf(talk.id), 1);

        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }

    function toggleBookmark() {
        if (bookmarked) {
            removeBookmark()
        } else {
            addBookmark()
        }

        if (updateParent) updateParent();

        setBookmarked(!bookmarked);
    }

    getUserRating();

    return (
        <Card>
            <CardTitleSection>
                <CardTitle>{talk.title}</CardTitle>
                <BookmarkIcon isBookmarked={bookmarked} onClick={toggleBookmark}/>
            </CardTitleSection>
            <li>Speaker: {talk.speaker}</li>
            <li>Time: {talk.time}</li>

            <StarRating rating={rating.value} avgRating={avgRating} empty={!rating.isUserRating}
                        onSelect={handleRating}/>
            <ButtonArea>
                {canRemove ? (<Button onClick={removeFromItinerary}>Remove from Itinerary</Button>) : (
                    <Button onClick={addToItinerary}>Add to My Itinerary</Button>)}
                <Button onClick={handleOpen}>More Info</Button>
            </ButtonArea>
            <TalkDetail talk={talk} showState={show} closeHandler={handleClose}/>
            {showAlert ? (<Alert variant="danger" style={{margin: '10px'}}>
                <Alert.Heading>Cannot add talk to itinerary.</Alert.Heading>
                <p>This timeslot is already occupied. Free up your itinerary before adding this talk. </p>
            </Alert>) : null}
        </Card>
    );
};

export default Talk;
