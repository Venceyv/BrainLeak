import { body } from "express-validator";
import { validate } from "./errorBack.js";

const replyValidator = validate([body("content").notEmpty().withMessage("error:'Reply can not be empty!'")]);
export { replyValidator };
