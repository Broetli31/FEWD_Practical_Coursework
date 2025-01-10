import SessionItinerary from "./SessionItinerary.jsx";
import {useEffect, useState} from "react";
import Form from 'react-bootstrap/Form'
import styled from "styled-components";

const SessionColumns = styled.div`
    display: grid;
    grid-template-columns: auto auto auto;
    overflow-x: scroll;
    width: auto;
    position: relative;
    //white-space: nowrap;
`;
const Sessions = () => {

    const desktopSize = 900;

    const [talks, setTalks] = useState({
        loading: false,
        data: [],
    });

    const [isDesktop, setDesktop] = useState(window.innerWidth > desktopSize);

    const updateMedia = () => {
        setDesktop(window.innerWidth > desktopSize)
    }

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    });

    const [filteredTalks, setFilteredTalks] = useState(talks.data);

    function fetchTalks() {
        // List Talks (GET http://localhost:3001/talks)
        setTalks({
            loading: true,
            data: talks.data,
        })
        fetch("http://localhost:3001/talks")
            .then((res) => res.json())
            .then((json) => json.sort((a, b) => {
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
            .then((sortedTalks) => setTalks({
                loading: false,
                data: sortedTalks,
            }))
            .then(console.log.bind(console))
            .catch(console.error.bind(console));
    }

    function onFilterUpdate(event) {
        const searchTerm = event.target.value.toLowerCase();

        if (!searchTerm || searchTerm.length < 1) {
            setFilteredTalks(talks.data);
            return;
        }

        const searchResults = talks.data.filter((talk) => {
            return talk.speaker.toLowerCase().includes(searchTerm)
                || talk.title.toLowerCase().includes(searchTerm)
                || talk.time.toLowerCase().includes(searchTerm)
        });

        setFilteredTalks(searchResults);
    }

    useEffect(() => {
        fetchTalks()
    }, []);

    useEffect(() => {
       setFilteredTalks(talks.data)
    }, [talks]); // for displaying data after loading but before any search term gets entered

    return (
        <>
            <Form.Control type="search" placeholder="Search Talks" onChange={onFilterUpdate}></Form.Control>
            <br />
            {isDesktop ? (
                <SessionColumns>
                    {talks.loading ? (<p>loading...</p>) : (<SessionItinerary talks={filteredTalks.filter((talk) => talk.session === 'A')} session="A" />)}
                    {talks.loading ? (<p>loading...</p>) : (<SessionItinerary talks={filteredTalks.filter((talk) => talk.session === 'B')} session="B" />)}
                    {talks.loading ? (<p>loading...</p>) : (<SessionItinerary talks={filteredTalks.filter((talk) => talk.session === 'C')} session="C" />)}
                </SessionColumns>
            ) :
                talks.loading ? (<p>loading...</p>) : (<SessionItinerary talks={filteredTalks} />)
            }
        </>
    );
};

export default Sessions;
