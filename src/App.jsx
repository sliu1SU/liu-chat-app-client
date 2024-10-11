import {useContext, useState} from 'react'
import './App.css'
import DisplayRoomList from "./DisplayRoomList.jsx";
import SignInAndUp from "./SignInAndUp.jsx";
import DisplayCurUser from "./DisplayCurUser.jsx";
import {UserContext} from "./UserContext.jsx";
import DisplayChatMsg from "./DisplayChatMsg.jsx";

function App() {
    const {user, showAllRooms} = useContext(UserContext);  // Access user and setUser
    const [msg, setMsg] = useState("");
    const [errMsg, setErrMsg] = useState("");

    // fn to fetch firebase welcome msg
    async function getFirebaseMsg() {
        const url = "api/";
        const response = await fetch(url);
        if (response.ok) {
            const resBody = await response.text();
            setErrMsg("");
            setMsg(resBody);
        } else {
            setErrMsg("Error: 400 - fetch Firebase msg failed!");
        }
    }

    if (!user) {
        // not logged in
        return (
            <>
                <SignInAndUp/>
            </>
        )
    } else {
        // a user is logged in
        if (showAllRooms) {
            // display room list
            return (
                <>
                    <DisplayCurUser/>
                    <DisplayRoomList/>
                </>
            )
        } else {
            // display chat msgs in a room
            return (
                <>
                    <DisplayCurUser/>
                    <DisplayChatMsg/>
                </>
            )
        }
    }
}

export default App
