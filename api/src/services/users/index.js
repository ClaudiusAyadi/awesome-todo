import { Router } from 'express';
import { protect } from '../auth/service.js';
import users from './service.js';

export default router => {
	const userRouter = Router();

	// Protect all routes after this middleware
	userRouter.use(protect);

	userRouter.get('/', users.getAll);
	userRouter
		.route('/:id')
		.get(users.getOne)
		.patch(users.update)
		.delete(users.delete);

	router.use('/users', userRouter);
};
