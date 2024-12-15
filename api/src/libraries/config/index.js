import ms from 'ms';
import p from '../../../package.json' with { type: 'json' };

export default {
	api: {
		name: p.name || 'api',
		prefix: process.env.PREFIX || '/api/v1',
		version: p.version || '1.0.0',
		host: process.env.HOST || 'localhost',
		port: process.env.PORT ? Number(process.env.PORT) : 8022,
		client: process.env.CLIENT || '*',
	},
	mode: {
		dev: process.env.NODE_ENV === 'development',
		live: process.env.NODE_ENV === 'production',
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		expiration: ms(process.env.JWT_EXPIRATION),
	},
	db: {
		protocol: process.env.DB_PROTOCOL,
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT) || 27017,
		name: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	},
	services: {
		health: true,
		auth: true,
		todos: true,
		users: true,
	},
};
