import app from './app.js';
import c from './libraries/config/index.js';
import mongo from './libraries/database/index.js';
import setupRoutes from './services/routes.js';
import { setupCatchAll } from './services/shared/index.js';

let initServer;

export const server = async () => {
	const { port } = c.api;
	try {
		await setupRoutes(app);
		await setupCatchAll(app);
		await mongo(c.db);
		initServer = app.listen(port, () => {
			console.info(`🎉 PORT: ${port}`);
			console.info(`🚀 Server is live`);
		});
		return initServer;
	} catch (error) {
		console.error('❌ Failed to initialize application:', error.message);
		process.exit(1);
	}
};

export const closeServer = callback => {
	if (initServer) {
		initServer.close(error => {
			if (error) {
				console.error('❌ Error during server shutdown:', error.message);
				process.exit(1);
			}
			if (callback) callback();
		});
	} else {
		console.warn('⚠️ Server not active!');
		if (callback) callback();
	}
};
