// put get all rooms in use context

import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "./UserContext.jsx";

async function GetAllRooms() {
    const {setUser} = useContext(UserContext);

    const url = "/api/rooms/init";
    const response = await fetch(url);
    let rooms = [];
    if (response.ok) {
        rooms = await response.json();
    } else {
        if (response.status === 401) {
            // cookie expired, redirect back to the signin/up page
            setUser(null);
        }
        return await response.text();
    }
    return rooms;
}

export default GetAllRooms;