import { Router } from 'express';
import { getUser, getUsers } from '../controllers/user.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:id', authorize, getUser);

userRouter.post('/', (req, res) => {
    res.json({ title: 'POST usuário' });
});

userRouter.put('/:id', (req, res) => {
    res.json({ title: 'PUT usuário' });
});

userRouter.delete('/:id', (req, res) => {
    res.json({ title: 'DELETE usuário' });
});

export default userRouter;
