import React, { useState, useEffect, createContext  } from "react";
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext(null); // Initial value null


export const AuthProvider = ({ children }) => {
    //user state variable to be provided to the entire app.
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // 
 

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/check_session");
        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
          setIsAuthenticated(true);
          navigate("/my_store");
          setError(""); // Clear any previous error
        }
      } catch (err) {
        setError(err);
        console.error(err);
        setIsAuthenticated(false)
      }
    };

    checkSession();
  }, []);

  console.log(error)

  // Function to log in the user
  const login = async (username, password) => {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        //wait for Promise to resolve.
        const data = await response.json();
        setCurrentUser(data);
        setIsAuthenticated(true);
        navigate('/my_store')
        setError(""); // Clear any previous error
      } else {
        const errorData = await response.json();
        console.log(errorData)
        setError(
          errorData.message ||
            "Failed to log in. Please check your credentials."
        );
      }
    } catch (err) {
      setError("Login request failed");
      console.error(err);
    }
  };

  console.log(isAuthenticated) // sets true after login.
  console.log(currentUser)

  // /signup 
  const signup = async (username, password, name, email) => {
    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, name, email }),
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
        setIsAuthenticated(true);
        // navigate to products page or another.
        // navigate("/my_store");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to sign up");
      }
    } catch (err) {
      setError("Signup request failed");
      console.error(err);
      setIsAuthenticated(false)
    }
  };

  const logOut = async () => {
    try {
      await fetch("/logout", {
        method: "DELETE",
      });
      setCurrentUser(null);
      setIsAuthenticated(false); // Reset authentication state
      navigate("/login"); // Navigate to login page after logout
    } catch (err) {
      setError("Failed to log out");
      console.error(err);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated, // Provide isAuthenticated state
        setIsAuthenticated,
        setError, // Provide error state
        login,
        signup,
        logOut,
        error, // Provide error state
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

