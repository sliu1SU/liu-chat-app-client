import {useContext, useEffect, useState} from 'react';
import {UserContext} from "./UserContext.jsx";
import {ChatRoomsContext} from "./ChatRoomsContext.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {firebaseAuth, signOut} from "./FirebaseAuth.jsx";
import Cookies from "js-cookie";

function DisplayChatMsg({sendOneMsg, testMsg}) {
    const params = useParams(); // this will contain the room id
    const {setUser, user} = useContext(UserContext);
    const {roomsHashTable, isLoading} = useContext(ChatRoomsContext);
    const [msgList, setMsgList] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();  // Get navigate function from useNavigate

    if (!sendOneMsg) {
        sendOneMsg = async function sendOneMsg() {
            // helper fn to handle sending one msg to the current chat room
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
    }

    useEffect(() => {
        if (testMsg) {
            // this is for testing purpose
            setMsgList(testMsg);
        } else {
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
        }
    }, []);

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
                <input id="new-msg-input" type="text" value={userInput} placeholder='enter msg here...'
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