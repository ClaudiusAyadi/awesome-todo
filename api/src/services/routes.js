import { Router } from 'express';
import c from '../libraries/config/index.js';

export const setupRoutes = async app => {
	const router = Router();

	for (const [service, enabled] of Object.entries(c.services)) {
		if (enabled) {
			try {
				const routes = await import(`./${service}/index.js`);

				// if imported routes have a default function, mount it
				// typeof routes.default === 'function'
				// 	? routes.default(router)
				// 	: console.warn(`No route handler found for service: ${service}`);

				if (typeof routes.default === 'function') {
					routes.default(router);
					console.info(`🔌 ${service} routes: mounted at /${service} ✅`);
				} else {
					console.warn(`❌ No default router found for service: ${service}`);
				}
			} catch (error) {
				console.error(`❌ Error loading routes for ${service}:`, error);
			}
		}
	}

	app.use(c.api.prefix, router);
};

export default setupRoutes;
