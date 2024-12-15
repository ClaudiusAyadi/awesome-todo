export const logger = (req, res, next) => {
	const date = Date.now();

	const options = {
		month: 'short',
		day: 'numeric',
		hour12: false,
		timeZone: 'Africa/Lagos',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	};

	res.on('finish', () => {
		const endTime = Date.now();
		const timeTaken = endTime - date;

		const timestamp = new Intl.DateTimeFormat('en-US', options).format(date);
		const colors = {
			success: '\x1b[32m',
			error: '\x1b[31m',
			silent: '\x1b[0m', // Reset color
		};
		const icon = res.statusCode < 400 ? '✅' : '❌';
		const color = res.statusCode < 400 ? colors.success : colors.error;

		console.info(
			`${timestamp}  ${icon}  ${colors.success}==>${colors.silent} ${color}${res.statusCode}${colors.silent} ${req.method} ${req.originalUrl} ${timeTaken}ms`
		);
	});

	next();
};
