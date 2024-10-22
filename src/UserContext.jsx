import React, {createContext, useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import GetCurUser from "./GetCurUser.jsx";

// Create a UserContext
export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);  // Define the state to hold user data
    // do a useEffect here to handle case where people enter url
    // option: try to decrypt auth token from cookie to get email and uid
    // option: do a get request again
    // option: store the entire user object from firebase in cookie

    console.log("UserProvider is called")

    useEffect(() => {
        const authToken = Cookies.get('authToken');
        if (authToken) {
            // someone is logged in, restore the state
            const restoreUser = async () => {
                const currentUser = await GetCurUser(); // Await the result of your async function
                setUser(currentUser); // Set the user state with the resolved user object
            };
            restoreUser(); // Call the async function
        }
    }, []);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}  {/* Render the children components */}
        </UserContext.Provider>
    );
}