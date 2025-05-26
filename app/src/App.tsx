import { useEffect, useState } from "react";

import "./App.css";
import { isTokenValid } from "./auth";
import Header from "./components/Header";
import Signin from "./components/Signin";
import ContainerLoggedIn from "./components/ContainerLoggedIn";

const LOCAL_STORAGE_AUTH_TOKEN_KEY = "LOCAL_STORAGE_AUTH_TOKEN_KEY";

function App() {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  // token is saved in localStorage
  const handleSignIn = (token: string) => {
    if (isTokenValid(token)) {
      setAccessToken(token);
      localStorage.setItem(LOCAL_STORAGE_AUTH_TOKEN_KEY, token);
    }
  };

  const handleSignout = () => {
    setAccessToken(undefined);
    localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN_KEY);
  };

  useEffect(() => {
    const authToken = localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY);
    if (isTokenValid(authToken)) {
      setAccessToken(authToken ?? undefined);
    } else {
      setAccessToken(undefined);
      // clear the value from localStorage too, it has expired!
      localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN_KEY);
    }
  }, []);

  const isSignedIn = accessToken !== undefined;

  return (
    <>
      <div>
        <Header isSignedIn={isSignedIn} handleSignout={handleSignout} />
        {/* Due to simplicity of app, I decided not to use a router and instead just use this ternary. */}
        {!isSignedIn ? (
          <Signin handleSignedIn={handleSignIn} />
        ) : (
          <ContainerLoggedIn accessToken={accessToken} />
        )}
      </div>
    </>
  );
}

export default App;
