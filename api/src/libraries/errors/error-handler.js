import { AppError } from './app-error.js';
import c from './../config/index.js';

const { mode } = c;

const errorObj = {
	cast(error) {
		const message = `Invalid ${error.path}: '${error.value}'`;
		return new AppError(message, 400);
	},

	duplication(error) {
		const message = `'${error.keyValue.name}' already exists`;
		return new AppError(message, 400);
	},

	validation(error) {
		const message = Object.values(error.errors)
			.map(value => {
				if (value.name === 'CastError') return errorObj.cast(value).message;
				if (value.name === 'ValidationError')
					return errorObj.validation(value).message;
				return `Invalid ${value.path}: ${value.message}`;
			})
			.join('. ');

		return new AppError(message, 400);
	},

	jwt() {
		return new AppError('Invalid token! Please log in again.', 401);
	},

	jwtExpired() {
		return new AppError('Access token has expired! Please login again.', 401);
	},
};

const sendErrorDev = (err, req, res) => {
	// A. API
	if (req.originalUrl.startsWith('/api'))
		return res.status(err.statusCode).json({
			status: err.status,
			code: err.code,
			error: err,
			message: err.message,
			stack: err.stack,
		});

	// B. RENDERED WEBSITE
	// 1. Log error to hosting server log (Programming or other unknown errors)
	console.error('ERROR 💣', err);

	// 2. Send error message to client
	return res.status(err.statusCode).render('error', {
		title: 'Something went wrong!',
		msg: err.message,
	});
};

const sendErrorProd = (err, req, res) => {
	// A. API
	if (req.originalUrl.startsWith('/api')) {
		// Operation or trusted errors: send to client
		if (err.isOperational)
			return res.status(err.statusCode).json({
				status: err.status,
				code: err.statusCode,
				message: err.message,
			});

		// 1. Log error (Programming or other unknown errors)
		console.error('ERROR 💣', err);

		// 2. Send generic message to client
		return res.status(500).json({
			status: 'error',
			code: err.statusCode,
			message: 'Something went wrong!',
		});
	}
	// B. RENDERED WEBSITE
	if (err.isOperational)
		return res.status(err.statusCode).render('error', {
			title: 'Something went wrong!',
			code: err.statusCode,
			msg: err.message,
		});

	// 1. Log error (Programming or other unknown errors)
	console.error('ERROR 💣', err);

	// 2. Send generic message to client
	return res.status(500).json({
		status: 'error',
		code: err.statusCode,
		message: 'Please try again later!',
	});
};

export const errorHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	err.code = err.statusCode;

	if (mode.dev) return sendErrorDev(err, req, res);

	if (mode.live) {
		let error = { ...err };
		error.message = err.message;

		if (error.name === 'CastError') error = errorObj.cast(error);
		if (error.code === 11000) error = errorObj.duplication(error);
		if (error.name === 'ValidationError') error = errorObj.validation(error);
		if (error.name === 'JsonWebTokenError') error = errorObj.jwt();
		if (error.name === 'TokenExpiredError') error = errorObj.jwtExpired();

		sendErrorProd(error, req, res);
	}
};
