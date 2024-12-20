import {useContext, useState} from "react";
import {UserContext} from "./UserContext.jsx";
import {useNavigate} from "react-router-dom";
import {firebaseAuth, signOut} from "./FirebaseAuth.jsx";
import Cookies from "js-cookie";

function DisplayCurUser({logOffFn}) {
    const {user, setUser} = useContext(UserContext);  // Access user and setUser
    const [errMsg, setErrMsg] = useState("");
    const navigate = useNavigate();  // Get navigate function from useNavigate

    if (!logOffFn) {
        logOffFn = async function logOffFn() {
            try {
                await signOut(firebaseAuth);
                // Clear the auth_token cookie
                Cookies.remove('authToken', { path: '/' });
                setUser(null);
                setErrMsg("");
                navigate('/');
            } catch (e) {
                setErrMsg(e);
            }
        }
    }

    // a user is log in
    // then display chat rooms or msgs in a room
    if (!user) {
        return (
            <div>
                No user...
            </div>
        )
    }
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