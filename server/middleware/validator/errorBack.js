import { validationResult } from "express-validator";

function validate(validator) {
  return async (req, res, next) => {
    await Promise.all(validator.map((validate) => validate.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ error: errors.array() });
    }
    next();
  };
}
export { validate };
