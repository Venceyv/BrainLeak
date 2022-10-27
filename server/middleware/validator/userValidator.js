import { body } from "express-validator";
import { validate } from "./errorBack.js";

const userValidator = validate([body("username").notEmpty().withMessage("error:'User name can not be empty!'")]);
export { userValidator };
