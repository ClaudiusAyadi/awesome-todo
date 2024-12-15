export class AppError extends Error {
	constructor(message, statusCode, code) {
		super(message);
		this.statusCode = statusCode;
		this.code = code || statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}
