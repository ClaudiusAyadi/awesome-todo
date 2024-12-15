import { Router } from 'express';
import todos from './service.js';

export default router => {
	const todoRouter = Router();

	todoRouter.route('/').get(todos.getAll).post(todos.add);
	todoRouter
		.route('/:id')
		.get(todos.getOne)
		.patch(todos.update)
		.delete(todos.delete);

	router.use('/todos', todoRouter);
};
