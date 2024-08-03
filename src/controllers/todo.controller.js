import { Todo } from "../models/todo.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTodo = asyncHandler(async (req, res) => {
  const { content, isCompleted } = req.body;
  if (!content) {
    throw new ApiError(401, "Content is required");
  }
  const todo = await Todo.create({
    content,
    isCompleted,
    userId: req.user?._id,
  });
  if (!todo) {
    throw new ApiError(500, "failed to create todo");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, todo, "todo created successfully"));
});
const getUserTodos = asyncHandler(async (req, res) => {
  console.log(req.user._id);

  const todos = await Todo.aggregate([
    {
      $match: {
        userId: req.user._id,
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, todos, "user Todos fetched successfully"));
});

const updateTodo = asyncHandler(async (req, res) => {
  const { isCompleted } = req.body;
  const { todoId } = req.params;

  if (!todoId) {
    throw new ApiError(402, "todoId is invalid");
  }
  const todo = await Todo.findById(todoId);
  if (!todo) {
    throw new ApiError(403, "todo is not present");
  }
  if (todo.userId.toString() !== req.user?._id.toString()) {
    throw new ApiError(401, "only owner can update the todo");
  }
  const newTodo = await Todo.findByIdAndUpdate(
    todoId,
    {
      $set: {
        isCompleted,
      },
    },
    { new: true }
  );
  if (!newTodo) {
    throw new ApiError(500, "todo was not updated please try again");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, newTodo, "todo updated successfully"));
});

const deleteTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  if (!todoId) {
    throw new ApiError(401, "Invalid todoId");
  }
  const todo = await Todo.findById(todoId);
  if (!todo) {
    throw new ApiError(401, "todo is not available");
  }
  if (todo.userId.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "only owner can edit the todo");
  }
  await Todo.findByIdAndDelete(todoId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "todo deleted successfully"));
});
export { createTodo, getUserTodos, deleteTodo, updateTodo };
