import {useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext.jsx";
import {ChatRoomsContext} from "./ChatRoomsContext.jsx";
import {Link, useNavigate} from "react-router-dom";
import GetAllRooms from "./GetAllRooms.jsx";

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

    // put get all rooms in use context
    async function getAllRooms() {
        const url = "/api/rooms/";
        const response = await fetch(url);
        if (response.ok) {
            setError("");
            const arr = await response.json();
            setRooms(arr);
            // update the hashtable
            let table = new Map();
            for (let i = 0; i < arr.length; i++) {
                table.set(arr[i].id, [arr[i].name, arr[i].description]);
            }
            setRoomsHashTable(table);
        } else {
            if (response.status === 401) {
                // cookie expired, redirect back to the signin/up page
                setUser(null);
                navigate('/');
            }
            setError(await response.text());
        }
    }

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
            await getAllRooms();
        } else {
            if (response.status === 401) {
                setUser(null);
                navigate('/');
            }
            setError(await response.text());
        }
    }

    // useEffect to exe once when this component is called
    // to fetch all rooms in the database
    useEffect(() => {
        getAllRooms();
        // // call the api to fetch all chat rooms every X seconds
        // const intervalId = setInterval(getAllRooms, 3000);
        // return () => {
        //     clearInterval(intervalId);
        // }
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
                    <input id="room-name-input" type="text" placeholder='enter room name here...'
                           onChange={event => setInputName(event.target.value)} />
                </label>
                <label>
                    {titleDesc}
                    <input id="room-decription-input" type="text" placeholder='enter description here...'
                           onChange={event => setInputDes(event.target.value)} />
                    <button id="submit-create-room-bt" onClick={createOneRoom}>create</button>
                </label>
            </section>
            <section className="error-message">{error}</section>
        </>
    )

}

export default DisplayRoomList;