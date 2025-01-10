import Talk from "./Talk.jsx";
import {useEffect, useState} from "react";


const BookmarkList = () => {
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

        const bookmarksJson = localStorage.getItem('bookmarks');
        const bookmarks = JSON.parse(bookmarksJson);


        fetch("http://localhost:3001/talks")
            .then((res) => res.json())
            .then((json) => json.filter((item) => (bookmarks.includes(item.id))))
            .then((talks => talks.sort((a, b) => a.title.localeCompare(b.title))))
            .then((sortedArray) => setTalks({
                loading: false,
                data: sortedArray,
            }))
            .then(console.log.bind(console))
            .catch(console.error.bind(console));
    }

    function updateFilter() {
        const bookmarksJson = localStorage.getItem('bookmarks');
        const bookmarks = JSON.parse(bookmarksJson);

        setTalks({
            loading: false,
            data: talks.data.filter((item) =>  bookmarks.includes(item.id))
        })
    }

    useEffect(() => {
        fetchTalks()
    }, []);

    return (
        <>
            {talks.loading ? (<p>loading...</p>) : talks.data.length === 0 ? (
                <p>No Bookmarks saved</p>) : talks.data.map((talk) => {
                return (
                    <Talk talk={talk ? talk : null} key={talk.id} updateParent={updateFilter}/>
                )
            })}
        </>
    )
}

export default BookmarkList;
