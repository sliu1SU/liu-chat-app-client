import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// function App() {
//   const [count, setCount] = useState(0)
//
//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

function App() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [errMsg, setErrMsg] = useState("");
    // return a html - sign up page OR landing page

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
            await getFirebaseMsg();
            //console.log(resBody);
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
            await getFirebaseMsg();
            //console.log(resBody);
        } else {
            setErrMsg("Error: 400 - log in failed!");
        }
    }

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
        } else {
            setErrMsg("Error: 400 - log off failed!");
        }
    }

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
    } else {
        // a user is log in
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
                        What you get from Firebase: {msg}
                    </div>
                    <div>
                        <p>{errMsg}</p>
                    </div>
                </div>
            </>
        )
    }
}

export default App
