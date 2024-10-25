import React, { useState, useEffect, createContext } from "react";
// import AuthContext to keep current user in state
// send POST request to backend to log the user in.
// update state if logged out.

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // send POST request to /users to log the user in.
        fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "exampleUser",
            password: "examplePassword",  // replace with actual user info.
            // add other fields as needed.
          }),
        })
          .then((res) => res.json())
          .then((data) => setCurrentUser(data));
    },[]);

    // handle errors and response status.

      return (
        <Context.Provider
          value={{
            currentUser,
            setCurrentUser,  // update the current user state.
            // logout: () => setCurrentUser(null), // log the user out.
          }}
        >
          {children}
        </Context.Provider>
      );


}


export { AuthProvider, AuthContext}