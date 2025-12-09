import { Router } from 'express';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => {
    res.send({title: 'GET assinaturas'});
});
subscriptionRouter.get('/:id', (req, res) => {
    res.send({title: 'GET detalhes de uma assinatura'});
});
subscriptionRouter.post('/', (req, res) => {
    res.send({title: 'POST assinatura'});
});
subscriptionRouter.put('/:id', (req, res) => {
    res.send({title: 'PUT assinatura'});
});
subscriptionRouter.delete('/:id', (req, res) => {
    res.send({title: 'DELETE assinatura'});
});
subscriptionRouter.get('/user/:id', (req, res) => {
    res.send({title: 'GET assinaturas de todos os usuários'});
});
subscriptionRouter.put('/:id/cancel', (req, res) => {
    res.send({title: 'CANCEL assinatura, usando PUT'});
});
subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({title: 'CANCEL assinatura, usando PUT'});
});


export default subscriptionRouter;