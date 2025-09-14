import express from "express";
import jwt from "jsonwebtoken";
import { DEMO_USER, JWT_SECRET } from "./auth/demoCreds";
import { auth } from "./auth/helpers";

const app = express();
app.use(express.json());


app.get("/", (_req, res) => {
    res.json({ ok: true, msg: "JWT mock server up" });
});

// POST /auth/login  -> returns JWT if creds match
app.post("/auth/login", (req, res) => {
    const { username, password } = req.body as {
        username?: string;
        password?: string;
    };

    // 1) validate body
    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "username and password required" });
    }

    // 2) check demo creds
    if (username !== DEMO_USER.username || password !== DEMO_USER.password) {
        return res.status(401).json({ error: "invalid credentials" });
    }

    // 3) sign JWT (HS256)
    const token = jwt.sign(
        { u: username, role: "user" },           // payload (keep tiny)
        JWT_SECRET,                               // secret (mock!)
        {
            algorithm: "HS256",
            expiresIn: "15m",
            issuer: "jwt-mock-server",
            subject: username,
        }
    );

    // 4) send token
    return res.json({ token });
});

// GET /user/me  -> only with valid JWT
app.get("/user/me", auth, (req, res) => {
    const u = (req as any).user as JwtPayload & { u?: string; role?: string };
    return res.json({
        auth: true,
        user: { username: u.sub || u.u, role: u.role || "user" },
    });
});




const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

