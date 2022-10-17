import {body} from 'express-validator';
import {validate} from './errorBack.js';

const commentValidator = validate([
    body('content')
    .notEmpty().withMessage('error:\'Content can not be empty!\''),
]
)
export {commentValidator};