import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import {
    createSubscription, getAllSubscriptions, getSubscription, getUserSubscriptions, updateSubscription, cancelSubscription, deleteSubscription, getUpcomingRenewals
} from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);
subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);
subscriptionRouter.get('/', getAllSubscriptions);
subscriptionRouter.get('/:id', getSubscription);
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.put('/:id', authorize, updateSubscription);
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);
subscriptionRouter.delete('/:id', authorize, deleteSubscription);

export default subscriptionRouter;