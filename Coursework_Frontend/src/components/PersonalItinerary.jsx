import {useEffect, useState} from "react";
import SessionItinerary from "./SessionItinerary.jsx";
import log from "eslint-plugin-react/lib/util/log.js";
import Talk from "./Talk.jsx";

const PersonalItinerary = () => {

    const [talks, setTalks] = useState({
        loading: false,
        data: [],
    });

    function fetchTalks() {
        // List Talks (GET http://localhost:3001/talks)
        setTalks({
            loading: true,
            data: talks.data,
        })

        const itineraryJson = localStorage.getItem('itinerary');
        let itinerary = JSON.parse(itineraryJson);
        itinerary = itinerary ? itinerary.map((item) => {item.id}) : [];


        fetch("http://localhost:3001/talks")
            .then((res) => res.json())
            .then((json) => json.filter((item) => (itinerary.includes(item.id))))
            .then((filteredArray) => filteredArray.sort((a, b) => {
                const dateA = new Date();
                const [hoursA, minutesA] = a.time.split(":").map(Number);
                dateA.setHours(hoursA);
                dateA.setMinutes(minutesA);

                const dateB = new Date();
                const [hoursB, minutesB] = b.time.split(":").map(Number);
                dateB.setHours(hoursB);
                dateB.setMinutes(minutesB);

                return dateA - dateB
                // sorting as a string did not work because the data contains e.g. 9:30 instead of 09:30
            }))
            .then((sortedArray) => setTalks({
                loading: false,
                data: sortedArray,
            }))
            .then(console.log.bind(console))
            .catch(console.error.bind(console));
    }

    function updateFilter() {
        const itineraryJson = localStorage.getItem('itinerary');
        const itinerary = JSON.parse(itineraryJson).map((item) => item.id);

        setTalks({
            loading: false,
            data: talks.data.filter((item) => itinerary.includes(item.id))
        })
    }

    useEffect(() => {
        fetchTalks()
    }, []);

    return (
        <>
            {talks.loading ? (<p>loading...</p>) : talks.data.length === 0 ? (
                <p>No items in itinerary</p>) : talks.data.map((talk) => {
                return (
                    <Talk talk={talk ? talk : null} key={talk.id} canRemove={true} updateParent={updateFilter}/>
                )
            })}
        </>
    )
}

export default PersonalItinerary;
