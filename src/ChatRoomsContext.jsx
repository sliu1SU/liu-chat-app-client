import React, {createContext, useEffect, useState} from 'react';
import GetAllRooms from "./GetAllRooms.jsx";

// Create a UserContext
export const ChatRoomsContext = createContext();

export function ChatRoomsProvider({ children }) {
    const [roomsHashTable, setRoomsHashTable] = useState(new Map());

    // can put get all rooms function
    useEffect(() => {
        // someone is logged in, restore the state
        const restoreTable = async () => {
            const arr = await GetAllRooms(); // Await the result of your async function
            let table = new Map();
            for (let i = 0; i < arr.length; i++) {
                table.set(arr[i].id, [arr[i].name, arr[i].description]);
            }
            setRoomsHashTable(table);
        };
        restoreTable(); // Call the async function
    }, []);
    return (
        <ChatRoomsContext.Provider value={{roomsHashTable, setRoomsHashTable }}>
            {children}  {/* Render the children components */}
        </ChatRoomsContext.Provider>
    );
}