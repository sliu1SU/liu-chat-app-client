import {useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext.jsx";

function DisplayCurUser() {
    const {user, setUser, setShowAllRooms, setRoomName, setRoomId} = useContext(UserContext);  // Access user and setUser
    const [errMsg, setErrMsg] = useState("");

    // fn to log off
    async function logOffFn() {
        const url = "api/logoff/";
        const data = {
            method: "POST",
        }
        const response = await fetch(url, data);
        if (response.ok) {
            setErrMsg("");
            setUser(null);
            setShowAllRooms(true);
            setRoomName("");
            setRoomId("");
        } else {
            setErrMsg("Error: 400 - log off failed!");
        }
    }

    // a user is log in
    // then display chat rooms or msgs in a room
    return (
        <>
            <div>
                <div>
                    uid: {user.uid} - email: {user.email}
                </div>
                <div>
                    <button id="submit-logoff-bt" onClick={logOffFn}>Log Off</button>
                </div>
                <div>
                    <p>{errMsg}</p>
                </div>
            </div>
        </>
    )

}

export default DisplayCurUser;