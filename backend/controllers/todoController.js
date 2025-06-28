import {
  fetchTodos,
  insertTodo,
  modifyTodo,
  removeTodo,
} from "../services/todoService.js";

/**
 * @desc    Fetch all todos for the currently authenticated user
 * @route   GET /api/todos
 * @access  Private
 */

export const getTodos = async (req, res) => {
  try {
    const userId = req.user?.id;

        // If user is not authenticated, return unauthorized
    if (!userId) return res.status(401).json({ error: "Unauthorized" });


       // Fetch todos from service layer
    const data = await fetchTodos(userId);
    res.status(200).json(data);
  } catch (err) {
        // Internal server error
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc    Create a new todo item for the authenticated user
 * @route   POST /api/todos
 * @access  Private
 */

export const createTodo = async (req, res) => {
  try {
    const userId = req.user?.id;

    // Block request if user not authenticated
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

      // Delegate todo creation to service
    const newTodo = await insertTodo(req.body, userId);

     // Return the created todo
    res.status(201).json({ success: true, data: newTodo });
  } catch (err) {
        // Bad request or validation error
    res.status(400).json({ error: err.message });
  }
};

/**
 * @desc    Update a specific todo item
 * @route   PUT /api/todos/:id
 * @access  Private
 */
export const updateTodo = async (req, res) => {
  try {
    const userId = req.user?.id;
    const todoId = req.params.id;

    // Update todo via service layer
    const updated = await modifyTodo(req.body, todoId, userId);

     // Return updated todo
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
        // Handle service/internal error
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc    Permanently delete a specific todo
 * @route   DELETE /api/todos/:id
 * @access  Private
 */
export const deleteTodo = async (req, res) => {
  try {
    const userId = req.user?.id;
    const todoId = req.params.id;

     // Delegate deletion logic to service
    await removeTodo(todoId, userId);

    // Return success status
    res.status(200).json({ success: true });
  } catch (err) {
      // Handle service/internal error
    res.status(500).json({ error: err.message });
  }
};
