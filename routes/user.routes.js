import { Router } from 'express';
import { getUser, getUsers, registerUser, getCurrentUser } from '../controllers/user.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.get('/me', authorize, getCurrentUser);

userRouter.get('/', getUsers);

userRouter.get('/:id', authorize, getUser);

userRouter.post('/register', registerUser);

export default userRouter;
