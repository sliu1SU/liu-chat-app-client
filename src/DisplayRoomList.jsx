import {useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext.jsx";

// component to display all chat rooms
function DisplayRoomList() {
    const {setRoomName, setRoomId, setShowAllRooms} = useContext(UserContext);
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState("");
    const [inputName, setInputName] = useState("");
    const [inputDes, setInputDes] = useState("");
    // some local vars to display static texts
    const titleName = 'room name: ';
    const titleDesc = 'room description: ';

    async function getAllRooms() {
        const url = "api/rooms/";
        const response = await fetch(url);
        if (response.ok) {
            setRooms(await response.json());
        } else {
            await getAllRooms();
        }
    }

    async function createOneRoom() {
        const url = 'api/rooms/';
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
            setError("ERROR: professor screwed up! please try again.");
        }
    }

    // useEffect to exe once when this component is called
    // to fetch all rooms in the database
    useEffect(() => {
        getAllRooms()
        // call the api to fetch all chat rooms every X seconds
        const intervalId = setInterval(getAllRooms, 3000);
        return () => {
            clearInterval(intervalId);
        }
    }, []);

    return (
        <>
            <section className="room-list">
                <ul>
                    {
                        rooms.map(room => (
                            <li key={room.id}>
                                <a onClick={() => {
                                    // this will update the roomName state in app(), so that
                                    // app() will render a single chat room
                                    setRoomName(room.name);
                                    setRoomId(room.id);
                                    setShowAllRooms(false);
                                }}>{room.id} - {room.name} - {room.description}</a>
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