import {useContext, useEffect, useState} from 'react'
import './App.css'
import SignInAndUp from "./SignInAndUp.jsx";
import {UserContext} from "./UserContext.jsx";
import {useNavigate} from "react-router-dom";

function App() {
    const {user} = useContext(UserContext);  // Access user and setUser
    const navigate = useNavigate();  // Get navigate function from useNavigate

    useEffect(() => {
        if (user) {
            // If a user is logged in, navigate to /rooms
            navigate('/rooms');
        }
    }, [user, navigate]); // Re-run this effect whenever `user` changes

    if (!user) {
        // not logged in
        return (
            <SignInAndUp/>
        )
    }
}

export default App
