import React, { useState } from "react";

interface ISignInProps {
  handleSignedIn: (accessToken: string) => void;
}

export default function Signin(props: ISignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const url = "http://localhost:8000/auth/signin";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      // convert to JSON asynchronously
      const resObj = await response.json();
      props.handleSignedIn(resObj.accessToken);
    } catch (err: unknown) {
      // display error
      console.log(err as Error);
      setErrorMessage((err as Error).message as string);
      setIsLoading(false); // only use in catch because the success path unmounts the component
    }
  };
  return (
    <div className="page">
      <div
        style={{
          marginBlockStart: "3rem",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Use a Controlled Form here */}
        <form
          style={{
            gap: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "3rem",
            width: "clamp(300px, 90vw, 400px)",
          }}
          className="card"
          onSubmit={handleSubmit}
        >
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            placeholder="Enter your name"
            style={{
              padding: "0.5rem",
              border: "1px solid black",
              borderRadius: "4px",
              marginBlockStart: "-1rem",
            }}
            onChange={handleEmailChange}
            value={email}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            style={{
              padding: "0.5rem",
              border: "1px solid black",
              borderRadius: "4px",
              marginBlockStart: "-1rem",
            }}
            onChange={handlePasswordChange}
            value={password}
          />
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
            }}
            disabled={email.length === 0 || password.length === 0 || isLoading}
          >
            {!isLoading ? "Sign in" : "Loading"}
          </button>
          <span style={{ color: "var(--danger-color)", minHeight: "24px" }}>
            {errorMessage}
          </span>
        </form>
      </div>
    </div>
  );
}
