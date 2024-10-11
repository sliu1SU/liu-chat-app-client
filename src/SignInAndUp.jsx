import {useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext.jsx";

function SignInAndUp() {
    const {setUser} = useContext(UserContext);  // Access user and setUser
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");

    // fn to log in
    async function logInFn() {
        const url = "api/login/";
        // create js object
        const body = {
            email: email,
            password: password
        }
        const data = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
        const response = await fetch(url, data);
        if (response.ok) {
            const resBody =  await response.json();
            setErrMsg("");
            setUser(resBody);
        } else {
            setErrMsg("Error: 400 - log in failed!");
        }
    }

    // fn to sign up
    async function signUpFn() {
        const url = "api/signup/";
        // create js object
        const body = {
            email: email,
            password: password
        }
        const data = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
        const response = await fetch(url, data);
        if (response.ok) {
            const resBody =  await response.json();
            setErrMsg("");
            setUser(resBody);
        } else {
            setErrMsg("Error: 400 - log in failed!");
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