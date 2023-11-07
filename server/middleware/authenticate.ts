import { Request, Response, NextFunction } from "express";
import verifyJWT from "../utils/verifyJWT.js";

async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const tokenInHeaders = req.get("Authorization");
    const token =
      // tokenInHeaders?.replace("Bearer ", "") || req.cookies.jwtToken;
      tokenInHeaders?.replace("Bearer ", "");
    console.log(token);
    if (!token) {
      res.status(401).json({ errors: "invalid token" });
      return;
    }
    const decoded = await verifyJWT(token);
    console.log(decoded);
    res.locals.userId = decoded.userId;
    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ errors: err.message });
      return;
    }
    res.status(401).json({ errors: "authenticate failed" });
  }
}

export default authenticate;
