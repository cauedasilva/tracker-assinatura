import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createSubscription, getAllSubscriptions, getSubscription, getUserSubscriptions } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', getAllSubscriptions);
subscriptionRouter.get('/:id', getSubscription);
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.put('/:id', (req, res) => {
    res.send({title: 'PUT assinatura'});
});
subscriptionRouter.delete('/:id', (req, res) => {
    res.send({title: 'DELETE assinatura'});
});
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);
subscriptionRouter.put('/:id/cancel', (req, res) => {
    res.send({title: 'CANCEL assinatura, usando PUT'});
});
subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({title: 'CANCEL assinatura, usando PUT'});
});

export default subscriptionRouter;