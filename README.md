# Dummy JWT Server

A minimal **Node.js + TypeScript** mock backend that demonstrates **JWT authentication** and how to automate token handling in **Postman**.  
Built as a showcase project to highlight clean, professional practices in a simple setup.

---

## Features
- **Auth endpoint**: `POST /auth/login`  
  - Accepts dummy credentials  
  - Returns a signed JWT (HS256)  

- **Protected endpoint**: `GET /user/me`  
  - Requires `Authorization: Bearer <token>`  
  - Verifies and returns mock user info  

- **Postman automation**  
  - Pre-request script sends login call automatically  
  - Retrieves JWT and injects it into request headers  

---

## Tech Stack
- [Node.js](https://nodejs.org/) (v20 LTS)  
- [Express](https://expressjs.com/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)  

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```
### 2. Run in dev mode
```bash
npm run dev
```

### 2 Test endpoints

POST http://localhost:3000/auth/login
{ "username": "demo@acme.com", "password": "pass123" }

GET http://localhost:3000/user/me with header:
Authorization: Bearer <token>

### Postman Setup

### 1. Add collection variables:

baseUrl = http://localhost:3000
username = demo@acme.com
password = pass123

### 2. Add this Pre-request Script at collection level:

pm.sendRequest({
  url: pm.collectionVariables.get("baseUrl") + "/auth/login",
  method: "POST",
  header: { "Content-Type": "application/json" },
  body: {
    mode: "raw",
    raw: JSON.stringify({
      username: pm.collectionVariables.get("username"),
      password: pm.collectionVariables.get("password")
    })
  }
}, (err, res) => {
  if (!err && res.code === 200) {
    const token = res.json().token;
    pm.collectionVariables.set("jwt", token);
  }
});

Use Authorization: Bearer {{jwt}} in your requests.
Now Postman will auto-fetch a fresh token before every call.

### ASCII diagram

## Architecture (High-Level)

+-------------+        POST /auth/login        +-------------+
|             | -----------------------------> |             |
|   Client    |                                |   Server    |
| (Postman)   | <----------------------------- |  (Express)  |
+-------------+       { token: <JWT> }         +-------------+
       |                                                 |
       |  GET /user/me with Authorization: Bearer <JWT>  |
       |------------------------------------------------>|
       |                                                 |
       | <-----------------------------------------------|
       |        { auth: true, user: { ... } }            |
       +-------------------------------------------------+

### License
MIT








