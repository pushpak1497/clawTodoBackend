import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTodo,
  deleteTodo,
  getUserTodos,
  updateTodo,
} from "../controllers/todo.controller.js";

const router = Router();
router.use(verifyJWT);
router.route("/").post(createTodo);
router.route("/").get(getUserTodos);
router.route("/:todoId").patch(updateTodo);
router.route("/:todoId").delete(deleteTodo);

export default router;
