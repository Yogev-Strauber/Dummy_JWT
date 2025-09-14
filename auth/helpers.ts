import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import express from "express";
import { JWT_SECRET } from "./demoCreds";

// Middleware to protect routes - checks for valid JWT bearer token

function auth(req: express.Request, res: express.Response, next: express.NextFunction) {

    const hdr = req.header("authorization");

    if (!hdr?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "missing bearer token" });
    }
    const token = hdr.slice(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            algorithms: ["HS256"],
            issuer: "jwt-mock-server",
        }) as JwtPayload & { u?: string; role?: string };
        (req as any).user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: "invalid or expired token" });
    }
}

export { auth };