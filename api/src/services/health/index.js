import { Router } from 'express';

export default router => {
	const healthRouter = Router();
	healthRouter.get('/', async (req, res) => {
		res
			.status(200)
			.json({ status: 'OK', message: 'Server pinged successfully!' });
	});

	router.use('/health', healthRouter);
};
