// Import express framework
import express from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";

// Initialize express router instance
const todosRouter = express.Router();

/**
 * @route   GET /api/todos/
 * @desc    Fetch all todos of the logged-in user
 */
todosRouter.get("/", getTodos);

/**
 * @route   POST /api/todos/
 * @desc    Add a new todo
 */
todosRouter.post("/", createTodo);

/**
 * @route   PUT /api/todos/:id
 * @desc    Update a specific todo
 */
todosRouter.put("/:id", updateTodo);

/**
 * @route   DELETE /api/todos/:id
 * @desc    Permanently delete a specific todo
 */
todosRouter.delete("/:id", deleteTodo);

// Export routes to be used in the main server
export default todosRouter;
