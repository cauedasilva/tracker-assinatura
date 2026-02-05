import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import {
    createSubscription, getAllSubscriptions, getSubscription, getUserSubscriptions, updateSubscription, cancelSubscription, deleteSubscription, getUpcomingRenewals
} from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/me', authorize, getUserSubscriptions);
subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);

subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.put('/:id', authorize, updateSubscription);
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);
subscriptionRouter.delete('/:id', authorize, deleteSubscription);

subscriptionRouter.get('/', authorize, getAllSubscriptions);
subscriptionRouter.get('/:id', authorize, getSubscription);

export default subscriptionRouter;