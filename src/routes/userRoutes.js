import express from "express";
import {
  registerUser,
  registerAdmin,
  login,
} from "../controllers/userControllers.js";
import { validate } from "../middleware/validate.js";
import { registerUserSchema } from "../schemas/userSchemas.js";
import { loginSchema } from "../schemas/loginSchemas.js";
import { registerAdminSchema } from "../schemas/adminSchemas.js";

const router = express.Router();

router.post("/auth/register-adm", validate(registerAdminSchema), registerAdmin);
router.post("/auth/register", validate(registerUserSchema), registerUser);
router.post("/login", validate(loginSchema), login);
export default router;
