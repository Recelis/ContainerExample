import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signin = async (
  request: Request,
  response: Response,
  _next: NextFunction,
  prisma: PrismaClient
) => {
  try {
    const { email, password } = request.body;
    console.log(email, password);

    if (typeof email !== "string") {
      throw new Error("Email is not of correct type");
    }
    const user = await prisma.profile.findUnique({ where: { email } });
    console.log(user);
    if (user === null) {
      throw new Error("Could not find User");
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isValid) {
      throw new Error("Token is not valid");
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (typeof jwtSecret !== "string") {
      throw new Error("jwtSecret is not correct type.");
    }

    const token = jwt.sign({ sub: user.id }, jwtSecret, {
      expiresIn: "1h",
    });
    return response.json({
      accessToken: token,
    });
  } catch (err) {
    // have a special log in server
    console.error(`sign in error`, JSON.stringify(err));
    return response.status(401).json({
      code: "Unauthorized",
      message: "Sign in details are not correct",
    });
  }
};
