import { body } from "express-validator";
import { validate } from "./errorBack.js";
const postValidator = validate([
  body("title")
    .notEmpty()
    .withMessage("Title can not be empty.")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Title length exceeded the maximum length."),
]);
export { postValidator };
