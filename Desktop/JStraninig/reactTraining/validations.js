import { body } from 'express-validator'

export const loginValidation = [
    body('email', 'enter valid email').isEmail(),
    body('password', 'enter valid password').isLength({ min: 5}),
]

export const registerValidation = [
    body('email', 'enter valid email').isEmail(),
    body('password', 'enter valid password').isLength({ min: 5}),
    body('fullName', 'enter correct full name').isLength({ min: 3}),
    body('avatarUrl').optional().isURL(),
]

export const postCreateValidation = [
    body('title', 'write title of post').isLength({ min: 3}).isString(),
    body('text', 'write text of post').isLength({ min: 10}).isString(),
    body('tags', 'not correct format of tags').optional().isString(),
    body('imageUrl', 'not correct URL').optional().isString(),
];