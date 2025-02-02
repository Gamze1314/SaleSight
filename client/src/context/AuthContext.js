import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null); // Initial value null

export const AuthProvider = ({ children }) => {
  //user state variable to be provided to the entire app.
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState(null); // Error state
  const navigate = useNavigate(); //

  // Check session on mount
  useEffect(() => {
    // Only check session if currentUser is set
    if (!currentUser) {
      const checkSession = async () => {
        try {
          const response = await fetch("/check_session", {
            method: "GET",
            credentials: "include", // Ensure cookies are sent with the request
          });

          if (response.ok) {
            const user = await response.json();
            setCurrentUser(user); // Set the user in the state
            navigate("/my_store"); // Redirect to the authenticated page
          } else {
            const errorData = await response.json();
            setAuthError(errorData.message);
          }
        } catch (err) {
          setAuthError("Please enter your credentials to login.");
          console.error(err);
        }
      };

      checkSession();
    }
  }, [currentUser, navigate]); // This effect runs only once when currentUser is null

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
        navigate("/my_store");
        setAuthError(""); // Clear any previous error
      } else {
        const errorData = await response.json();
        console.log(errorData);
        setAuthError(
          errorData.message ||
            "Failed to log in. Please check your credentials."
        );
      }
    } catch (err) {
      setAuthError("Login request failed.Please try again later.");
      console.error(err);
    }
  };

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
      if (response.status === 200) {
        const data = await response.json();
        setCurrentUser(data);
        // navigate to products page or another.
        navigate("/my_store");
        setAuthError("");
      } else {
        const errorData = await response.json();
        setAuthError(errorData.message || "Failed to sign up");
      }
    } catch (err) {
      setAuthError(
        "Signup request failed. Please check your credentials and try again."
      );
      console.error(err);
    }
  };

  const logOut = async () => {
    try {
      await fetch("/logout", {
        method: "DELETE",
      });
      setCurrentUser(null);
      navigate("/login"); // Navigate to login page after logout
      setAuthError("");
    } catch (err) {
      setAuthError("Failed to log out");
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        setAuthError, // Provide error state
        login,
        signup,
        logOut,
        authError, // Provide error state
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
