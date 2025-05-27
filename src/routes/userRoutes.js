import express from "express";
import { registerUser } from "../controllers/userControllers.js";
import { validate } from "../middleware/validate.js";
import { registerUserSchema } from "../schemas/userSchemas.js";
const router = express.Router();

router.post("/auth/register", validate(registerUserSchema), registerUser);
export default router;
