
// Import necessary modules
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Authentication middleware
import authMiddleware from "./middleware/authMiddleware.js";

// Import route handlers
import todosRoute from "./routes/todos.js";
import authRoutes from "./routes/auth.js";
import userRoute from "./routes/user.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// --------------------
//  Allowed Origins
// --------------------
const allowedOrigins = [
  "http://localhost:3000", // local frontend
 "https://to-do-list-frontend-plum.vercel.app", // deployed frontend (Vercel)
];

// --------------------
//  CORS Middleware
// -------------------
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


// --------------------
//  Global Middlewares
// --------------------
app.use(cookieParser());
app.use(express.json()); // parse JSON request bodies

// --------------------
//  Routes
// --------------------
app.use("/api/auth", authRoutes); // public auth routes
app.use("/api/user", authMiddleware, userRoute); // protected user info
app.use("/api/todos", authMiddleware, todosRoute); // protected todos

//  Basic health check route
app.get("/", (req, res) => {
  res.send("To-Do List Backend Server is running.");
});

// --------------------
//  Start the Server
// --------------------
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
