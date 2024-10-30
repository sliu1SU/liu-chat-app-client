import {useContext, useEffect, useState} from 'react';
import {UserContext} from "./UserContext.jsx";
import {ChatRoomsContext} from "./ChatRoomsContext.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {firebaseAuth, signOut} from "./FirebaseAuth.jsx";
import Cookies from "js-cookie";

function DisplayChatMsg() {
    const params = useParams(); // this will contain the room id
    const {setUser, user} = useContext(UserContext);
    const {roomsHashTable, isLoading} = useContext(ChatRoomsContext);
    const [msgList, setMsgList] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();  // Get navigate function from useNavigate

    // // helper fn to get all the chat msgs in this room
    // async function getAllMsgs() {
    //     const url = `/api/room/${params.roomId}`;
    //     console.log(params.roomId)
    //     const response = await fetch(url);
    //     if (response.ok) {
    //         const msg = await response.json();
    //         setMsgList(msg);
    //         setError("");
    //         console.log(roomsHashTable, roomsHashTable.size)
    //         if (!roomsHashTable.has(params.roomId)) {
    //             console.log(params.roomId)
    //             setRoomExist(false);
    //         }
    //     } else {
    //         if (response.status === 401) {
    //             setUser(null);
    //             navigate('/');
    //         }
    //         setError(await response.text());
    //     }
    // }

    // helper fn to handle sending one msg to the current chat room
    async function sendOneMsg() {
        const url = `/api/room/${params.roomId}`;
        let body = {
            content: userInput,
            time: Date.now(), // ms since epoch
            sender: user.uid
        }
        console.log(body);
        body = JSON.stringify(body);
        const data = {
            method: 'POST',
            headers: { // Ensure this header is set
                'Content-Type': 'application/json'
            },
            body: body
        };
        const response = await fetch(url, data);
        if (response.ok) {
            setError("");
            setUserInput("");
            // call this fn again to let react know to rerender the chat list
            //await getAllMsgs();
        } else {
            if (response.status === 401) {
                // cookies expired
                try {
                    await signOut(firebaseAuth);
                    // Clear the auth_token cookie
                    Cookies.remove('authToken', { path: '/' });
                    setError("");
                    setUser(null);
                    navigate('/');
                } catch (e) {
                    setError(e);
                }
            }
            setError(await response.text());
        }
    }

    // useEffect(() => {
    //     getAllMsgs();
    //     // //call the api to fetch all chat msgs every X seconds
    //     // const intervalId = setInterval(getAllMsgs, 3000);
    //     // return () => {
    //     //     clearInterval(intervalId);
    //     // };
    // }, []);

    useEffect(() => {
        // const authToken = Cookies.get('authToken');
        // if (!authToken) {
        //     signOut(firebaseAuth);
        //     setUser(null);
        //     navigate('/');
        //     return;
        // }

        const eventSource = new EventSource(`/api/room/${params.roomId}`);

        eventSource.onmessage = function(event) {
            const newMessages = JSON.parse(event.data);
            setMsgList(newMessages);  // Update the messages state
        };

        eventSource.onerror = function(err) {
            if (err.status === 401) {
                signOut(firebaseAuth);
                setUser(null);
                navigate('/');
            }
            setError("Error receiving updates");
            eventSource.close();
        };

        // Clean up when the component is unmounted
        return () => {
            eventSource.close();
        };
    }, []);

    // react to render a list of msgs in this chat room
    // do a get request to populate roomHashTable, make sure you check if cookie is available
    // if (isLoading) {
    //     return (
    //         <div>Loading hash table...</div>
    //     )
    // }

    if (roomsHashTable.size === 0 || !roomsHashTable.has(params.roomId)) {
        return (
            <div>
                Room (id = {params.roomId}) Does Not Exist!
                <section>
                    <Link to={"/rooms"}>Back</Link>
                </section>
            </div>
        )
    }

    return (
        <>
            <section className="show-msgs">
                <h1>Chat Room: {roomsHashTable.get(params.roomId)[0]}</h1>
                <ul>
                    {
                        msgList.map(msg => (
                            <li key={msg.id}>
                                {msg.sender} @ {new Date(msg.time).toLocaleString()}: {msg.content}
                            </li>
                        ))
                    }
                </ul>
            </section>
            <section className="new-chat-msg-input">
                <input id="new-msg-input" type="text" value={userInput}
                       onChange={event => setUserInput(event.target.value)} />
                <button id="send-new-msg-bt" onClick={sendOneMsg}>send</button>
            </section>
            <section>
                <Link to={"/rooms"}>Back</Link>
            </section>
            <section className="error-message">{error}</section>
        </>
    )
}

export default DisplayChatMsg;