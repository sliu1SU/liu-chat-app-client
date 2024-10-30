import React, {createContext, useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {firebaseAuth, onAuthStateChanged} from "./FirebaseAuth.jsx";

// Create a UserContext
export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);  // Define the state to hold user data

    // useEffect(() => {
    //     const authToken = Cookies.get('authToken');
    //     if (authToken) {
    //         // someone is logged in, restore the state
    //         const restoreUser = async () => {
    //             const currentUser = await GetCurUser(); // Await the result of your async function
    //             setUser(currentUser); // Set the user state with the resolved user object
    //         };
    //         restoreUser(); // Call the async function
    //     }
    // }, []);

    useEffect(() => {
        const authToken = Cookies.get('authToken');
        if (authToken) {
            //console.log("token here!")
            const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
                setUser(currentUser);  // Set user if logged in, or null if logged out
            });
            // Clean up the observer when the component unmounts
            return () => unsubscribe();

        }
    }, []);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}  {/* Render the children components */}
        </UserContext.Provider>
    );
}