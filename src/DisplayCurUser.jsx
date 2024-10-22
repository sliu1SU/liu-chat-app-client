import {useContext, useState} from "react";
import {UserContext} from "./UserContext.jsx";
import {useNavigate} from "react-router-dom";

function DisplayCurUser() {
    const {user, setUser} = useContext(UserContext);  // Access user and setUser
    const [errMsg, setErrMsg] = useState("");
    const navigate = useNavigate();  // Get navigate function from useNavigate

    // fn to log off
    async function logOffFn() {
        const url = "/api/logoff/";
        const data = {
            method: "POST",
        }
        const response = await fetch(url, data);
        if (response.ok) {
            setErrMsg("");
            setUser(null);
            navigate("/");
        } else {
            setErrMsg("Error: 400 - log off failed!");
        }
    }

    // a user is log in
    // then display chat rooms or msgs in a room
    if (!user) {
        return (
            <div>
                uid: placeholder - email: placeholder
            </div>
        )
    } else {
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
}

export default DisplayCurUser;