import {useContext, useState} from "react";
import {UserContext} from "./UserContext.jsx";
import {useNavigate} from "react-router-dom";
import {firebaseAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "./FirebaseAuth.jsx";
import Cookies from "js-cookie";

function SignInAndUp({logInFn, signUpFn}) {
    const {setUser} = useContext(UserContext);  // Access user and setUser
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const navigate = useNavigate();  // Get navigate function from useNavigate

    if (!logInFn) {
        logInFn = async function logInFn() {
            const userCredential  = await signInWithEmailAndPassword(firebaseAuth, email, password);
            const user = userCredential.user;
            if (user) {
                // Set the token in a cookie
                Cookies.set('authToken', user.stsTokenManager.accessToken, {expires: 30/1440});
                console.log('log in...user:',user)
                setUser(user);
                setErrMsg("");
                navigate('/rooms');
            } else {
                setErrMsg("Error: 400 - log in failed!");
            }
        }
    }

    if (!signUpFn) {
        signUpFn = async function signUpFn() {
            const userCredential  = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const user = userCredential.user;
            if (user) {
                // Set the token in a cookie
                Cookies.set('authToken', user.stsTokenManager.accessToken, {expires: 30/1440});
                console.log('sign up...user:',user)
                setUser(user);
                setErrMsg("");
                navigate('/rooms');
            } else {
                setErrMsg("Error: 400 - log in failed!");
            }
        }
    }

    return (
        <>
            <div>
                <input id="email-input" type="text" name="email" placeholder='Enter email here...'
                       onChange={e => setEmail(e.target.value)} />
                <input id="password-input" type="text" name="password" placeholder='Enter password here...'
                       onChange={e => setPassword(e.target.value)} />
                <button id="submit-login-bt" onClick={logInFn}>Log In</button>
                <button id="submit-signup-bt" onClick={signUpFn}>Sign Up</button>
            </div>
            <div>
                <p>{errMsg}</p>
            </div>
        </>
    )
}

export default SignInAndUp;