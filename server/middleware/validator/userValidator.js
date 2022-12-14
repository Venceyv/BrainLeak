import { body } from "express-validator";
import { validate } from "./errorBack.js";

const userValidator = validate([
  body("username")
    .notEmpty()
    .withMessage("error:'User name can not be empty!'")
    .bail()
    .isLength({ max: 30 })
    .withMessage("User name length exceeded the maximum length."),
  body("introduction").isLength({ max: 200 }).withMessage("Introduction length exceeded the maximum length."),
]);
export { userValidator };
