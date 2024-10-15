import {useContext, useEffect, useState} from 'react';
import {UserContext} from "./UserContext.jsx";
import {ChatRoomsContext} from "./ChatRoomsContext.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";

function DisplayChatMsg() {
    const params = useParams(); // this will contain the room id
    const {setUser, setRoomName, setRoomId, user, setShowAllRooms} = useContext(UserContext);
    const {roomsHashTable} = useContext(ChatRoomsContext);
    const [msgList, setMsgList] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();  // Get navigate function from useNavigate

    // helper fn to get all the chat msgs in this room
    async function getAllMsgs() {
        const url = `/api/room/${params.roomId}`;
        const response = await fetch(url);
        if (response.ok) {
            const msg = await response.json();
            setMsgList(msg);
            setError("");
        } else {
            if (response.status === 401) {
                setUser(null);
                navigate('/');
            }
            setError(await response.text());
        }
    }

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
            await getAllMsgs();
        } else {
            if (response.status === 401) {
                setUser(null);
                navigate('/');
            }
            setError(await response.text());
        }
    }

    // call api once to fetch all existing msgs in this chat room at the beginning
    useEffect(() => {
        getAllMsgs();
        // //call the api to fetch all chat msgs every X seconds
        // const intervalId = setInterval(getAllMsgs, 3000);
        // return () => {
        //     clearInterval(intervalId);
        // };
    }, []);

    // react to render a list of msgs in this chat room
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