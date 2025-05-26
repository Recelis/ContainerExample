import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * Given a token, decode and check that it is valid and not expired.
 */
export const authenticateToken = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // expect the token to be of form Bearer ey...
  // so only extract the ey part
  const bearer = request.headers["authorization"];
  if (bearer === undefined) {
    return response.status(401).json({
      code: "Unauthorized",
      message: "Token not valid",
      details: "Token was not found in header",
    });
  }
  try {
    const token = bearer.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;
    if (typeof jwtSecret !== "string") {
      throw "jwtSecret is not correct type.";
    }
    const decoded = jwt.verify(token, jwtSecret);
    response.locals.user_id = decoded.sub; // this is defined when signing auth.ts
    // go to next middleware
    next();
  } catch (err) {
    console.error("authorisation failed", JSON.stringify(err));
    // stops users from passing in an invalid token
    return response.status(403).json({
      code: "Forbidden",
      message: "You are not authorised to perform this action.",
    });
  }
};
