import { AppError, errorHandler } from '../../libraries/errors/index.js';

export const setupCatchAll = async app => {
	app.all('*', (req, res, next) => {
		next(
			new AppError(
				`This resource '${req.originalUrl}' cannot be found on this server`,
				404
			)
		);
	});

	app.use(errorHandler);

	return app;
};
