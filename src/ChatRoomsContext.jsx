import React, {createContext, useEffect, useState} from 'react';
import Cookies from "js-cookie";

// Create a UserContext
export const ChatRoomsContext = createContext();

export function ChatRoomsProvider({ children }) {
    const [roomsHashTable, setRoomsHashTable] = useState(new Map());
    const [isLoading, setIsLoading] = useState(true);  // Add loading state

    // can put get all rooms function
    useEffect(() => {
        const authToken = Cookies.get('authToken');
        if (authToken) {
            console.log('restoring table')
            // someone is logged in, restore the hash table
            const restoreTable = async () => {
                const url = "/api/rooms/init";
                const response = await fetch(url);
                let rooms = [];
                if (response.ok) {
                    rooms = await response.json();
                }
                let table = new Map();
                for (let i = 0; i < rooms.length; i++) {
                    table.set(rooms[i].id, [rooms[i].name, rooms[i].description]);
                }
                setRoomsHashTable(table);
                setIsLoading(false);  // Set loading to false once the table is restored
            };
            restoreTable(); // Call the async function
        }
    }, []);
    return (
        <ChatRoomsContext.Provider value={{roomsHashTable, setRoomsHashTable, isLoading}}>
            {children}  {/* Render the children components */}
        </ChatRoomsContext.Provider>
    );
}