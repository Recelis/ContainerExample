import { jwtDecode } from "jwt-decode";

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);

    // Check expiration
    const currentTime = Date.now() / 1000; // in seconds
    return decoded.exp !== undefined && decoded.exp > currentTime;
  } catch (err) {
    console.error("Invalid token", err);
    return false;
  }
};
