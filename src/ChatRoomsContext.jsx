import React, { createContext, useState } from 'react';

// Create a UserContext
export const ChatRoomsContext = createContext();

export function ChatRoomsProvider({ children }) {
    const [roomsHashTable, setRoomsHashTable] = useState(new Map());

    return (
        <ChatRoomsContext.Provider value={{roomsHashTable, setRoomsHashTable}}>
            {children}  {/* Render the children components */}
        </ChatRoomsContext.Provider>
    );
}