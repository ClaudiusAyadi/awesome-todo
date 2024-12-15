import { server, closeServer } from './server.js';

process.on('uncaughtException', error => {
	console.error('⛔ UNCAUGHT EXCEPTION!🚫 Server is shutting down...');
	console.error(`${error.name}: ${error.message}`);
	process.exit(1);
});

server();

process.on('unhandledRejection', error => {
	console.error('⛔ UNHANDLED REJECTION!🚫 Server is shutting down...');
	console.error(`${error.name}: ${error.message}`);
	closeServer(() => process.exit(1));
});

process.on('SIGTERM', () => {
	console.info('👋🏼 SIGTERM RECEIVED! 💥 Process Terminated!');
	closeServer(() => {
		console.info('⏹️ Server shut down gracefully!');
		process.exit(0);
	});
});
