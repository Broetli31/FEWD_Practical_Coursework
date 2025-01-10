import {useState} from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import NavigationBar from "./components/NavigationBar";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import MyItinerary from "./pages/MyItinerary.jsx";
import Bookmarks from "./pages/Bookmarks.jsx";

function App() {

    return (
        <>
            <NavigationBar />
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/itinerary" element={<MyItinerary/>}/>
                <Route path="/bookmarks" element={<Bookmarks />} />
            </Routes>
        </>
    );

}

export default App
