import {useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext.jsx";
import {ChatRoomsContext} from "./ChatRoomsContext.jsx";
import {Link, useNavigate} from "react-router-dom";
import {firebaseAuth, signOut} from "./FirebaseAuth.jsx";
import Cookies from "js-cookie";

// component to display all chat rooms
function DisplayRoomList() {
    const {setUser} = useContext(UserContext);
    const {setRoomsHashTable} = useContext(ChatRoomsContext);
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState("");
    const [inputName, setInputName] = useState("");
    const [inputDes, setInputDes] = useState("");
    const navigate = useNavigate();  // Get navigate function from useNavigate
    // some local vars to display static texts
    const titleName = 'room name: ';
    const titleDesc = 'room description: ';

    // // put get all rooms in use context
    // async function getAllRooms() {
    //     const url = "/api/rooms/";
    //     const response = await fetch(url);
    //     if (response.ok) {
    //         setError("");
    //         const arr = await response.json();
    //         setRooms(arr);
    //         // update the hashtable
    //         let table = new Map();
    //         for (let i = 0; i < arr.length; i++) {
    //             table.set(arr[i].id, [arr[i].name, arr[i].description]);
    //         }
    //         setRoomsHashTable(table);
    //     } else {
    //         if (response.status === 401) {
    //             // cookie expired, redirect back to the signin/up page
    //             setUser(null);
    //             navigate('/');
    //         }
    //         setError(await response.text());
    //     }
    // }

    async function createOneRoom() {
        const url = '/api/rooms/';
        const data = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: inputName,
                description: inputDes
            })
        }
        const response = await fetch(url, data);
        if (response.ok) {
            setError("");
            // need to call the get all rooms again to update the rooms (array) so that
            // react will rerender this portion
            //await getAllRooms();
            setInputName("");
            setInputDes("");
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
    //     getAllRooms();
    //     // // call the api to fetch all chat rooms every X seconds
    //     // const intervalId = setInterval(getAllRooms, 3000);
    //     // return () => {
    //     //     clearInterval(intervalId);
    //     // }
    // }, []);

    // SSE connection for real-time updates
    useEffect(() => {
        // const authToken = Cookies.get('authToken');
        // if (!authToken) {
        //     signOut(firebaseAuth);
        //     setUser(null);
        //     navigate('/');
        //     return;
        // }

        const eventSource = new EventSource('/api/rooms/');  // Connect to the SSE endpoint

        // Listen for incoming rooms data from the server
        eventSource.onmessage = (event) => {
            const newRooms = JSON.parse(event.data);
            setRooms(newRooms);  // Update state with the new list of rooms

            // Update the rooms hash table
            let table = new Map();
            for (let i = 0; i < newRooms.length; i++) {
                table.set(newRooms[i].id, [newRooms[i].name, newRooms[i].description]);
            }
            setRoomsHashTable(table);
        };

        // Handle any errors
        eventSource.onerror = (error) => {
            if (error.status === 401) {
                signOut(firebaseAuth);
                setUser(null);
                navigate('/');
            }
            setError('Error connecting to the server for real-time updates.');
            eventSource.close();  // Close the connection if there's an error
        };

        // Clean up the event source on component unmount
        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <>
            <section className="room-list">
                <ul>
                    {
                        rooms.map(room => (
                            <li key={room.id}>
                                <Link to={`/rooms/${room.id}`}>{room.id} - {room.name} - {room.description}</Link>
                            </li>
                        ))
                    }
                </ul>
            </section>
            <section className="room-create">
                <label>
                    {titleName}
                    <input id="room-name-input" type="text" placeholder='enter room name here...' value={inputName}
                           onChange={event => setInputName(event.target.value)} />
                </label>
                <label>
                    {titleDesc}
                    <input id="room-decription-input" type="text" placeholder='enter description here...' value={inputDes}
                           onChange={event => setInputDes(event.target.value)} />
                    <button id="submit-create-room-bt" onClick={createOneRoom}>create</button>
                </label>
            </section>
            <section className="error-message">{error}</section>
        </>
    )
}

export default DisplayRoomList;