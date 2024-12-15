import { Router } from 'express';
import {
	forgotPassword,
	protect,
	resetPassword,
	signin,
	signout,
	signup,
	updatePassword,
} from './service.js';

export default router => {
	const authRouter = Router();

	authRouter.post('/signup', signup);
	authRouter.post('/signin', signin);
	authRouter.get('/signout', signout);
	authRouter.post('/forgotPassword', forgotPassword);
	authRouter.patch('/resetPassword/:token', resetPassword);
	authRouter.patch('/updatePassword', protect, updatePassword);

	router.use('/auth', authRouter);
};
