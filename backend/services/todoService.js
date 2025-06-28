import { supabase } from "../config/supabaseClient.js";
import { calculateStatus } from "../utils/statusUtils.js";

/**
 * @desc    Fetch all todos for a specific user
 * @param   {string} userId - Authenticated user ID
 * @returns {Array} list of todos ordered by start date
 * @throws  {Error} if database query fails
 */
export const fetchTodos = async (userId) => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .order("start_date", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

/**
 * @desc    Insert a new todo task
 * @param   {object} todo - Payload containing title, category, dates, etc.
 * @param   {string} userId - Authenticated user ID
 * @returns {object} inserted todo item
 * @throws  {Error} if required fields are missing or database insert fails
 */
export const insertTodo = async (todo, userId) => {
  const { category, title, subtasks = [], start_date, due_date } = todo;

   // Validate required fields
  if (!category || !title || !start_date || !due_date) {
    throw new Error("Missing required fields");
  }

    // Determine status dynamically based on dates
  const status = calculateStatus(start_date, due_date);

  const { data, error } = await supabase
    .from("todos")
    .insert([{
      user_id: userId,
      category,
      title,
      subtasks,
      start_date,
      due_date,
      status,
      is_deleted: false,
      date_modified: new Date().toISOString(),
    }])
    .select("*");

  if (error) throw new Error(error.message);
  return data[0];
};

/**
 * @desc    Update an existing todo by ID
 * @param   {object} updates - Fields to be updated (title, dates, etc.)
 * @param   {string} todoId - ID of the todo to update
 * @param   {string} userId - Authenticated user ID
 * @returns {object} updated todo
 * @throws  {Error} if update fails
 */
export const modifyTodo = async (updates, todoId, userId) => {
  const {
    category,
    title,
    subtasks,
    start_date,
    due_date,
    status,
    is_deleted,
  } = updates;

  const updateFields = {
    date_modified: new Date().toISOString(),
  };

   // Only update provided fields
  if (category) updateFields.category = category;
  if (title) updateFields.title = title;
  if (subtasks) updateFields.subtasks = subtasks;
  if (start_date) updateFields.start_date = start_date;
  if (due_date) updateFields.due_date = due_date;
  if (typeof is_deleted === "boolean") updateFields.is_deleted = is_deleted;

    // Auto-calculate status if dates are updated
  if (start_date && due_date) {
    updateFields.status = calculateStatus(start_date, due_date);
  } else if (status) {
    updateFields.status = status;
  }

  const { data, error } = await supabase
    .from("todos")
    .update(updateFields)
    .eq("id", todoId)
    .eq("user_id", userId)
    .select("*");

  if (error) throw new Error(error.message);
  return data[0];
};

/**
 * @desc    Permanently delete a todo item
 * @param   {string} todoId - ID of the todo to delete
 * @param   {string} userId - Authenticated user ID
 * @throws  {Error} if deletion fails
 */
export const removeTodo = async (todoId, userId) => {
  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", todoId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
};
