/**
 * @function calculateStatus
 * @description Determines the status of a task based on its start and due dates.
 *
 * Possible return values:
 * - "upcoming": Task has not started yet.
 * - "ongoing": Task is currently in progress (today is between start and due dates, inclusive).
 * - "pending": Task has passed its due date and was not completed.
 *
 * @param {string | Date} start - Start date of the task (can be string or Date object).
 * @param {string | Date} due - Due date of the task (can be string or Date object).
 * @returns {string} One of the following status strings: "upcoming", "ongoing", or "pending".
 */
export const calculateStatus = (start, due) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Normalize to start of the day

  const startDate = new Date(start);
  startDate.setHours(0, 0, 0, 0); // Normalize to start of the day

  const dueDate = new Date(due);
  dueDate.setHours(0, 0, 0, 0);  // Normalize to start of the day

  // If today is between start and due (inclusive), it's ongoing
  if (today >= startDate && today <= dueDate) {
    return "ongoing";
  } else if (today < startDate) {
      // If start date is in the future
    return "upcoming";
  } else {
    // Otherwise, it's past due and pending
    return "pending";
  }
};
