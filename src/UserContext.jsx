import React, { createContext, useState } from 'react';

// Create a UserContext
export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);  // Define the state to hold user data
    const [showAllRooms, setShowAllRooms] = useState(true);
    const [roomName, setRoomName] = useState("");
    const [roomId, setRoomId] = useState("");

    return (
        <UserContext.Provider value={{ user, setUser, showAllRooms,
            setShowAllRooms, roomName, setRoomName, roomId, setRoomId }}>
            {children}  {/* Render the children components */}
        </UserContext.Provider>
    );
}