import { Router } from 'express';

const userRouter = Router();

userRouter.get('/', (req, res) => {
    res.json({ title: 'GET usuários' });
});

userRouter.get('/:id', (req, res) => {
    res.json({ title: 'GET detalhes de um usuário' });
});

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
