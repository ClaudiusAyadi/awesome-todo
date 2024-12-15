import mongoose from 'mongoose';

export default async db => {
	const { protocol, host, port, name, user, password } = db;

	const uri =
		protocol === 'mongodb'
			? `${protocol}://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${name}`
			: `${protocol}://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/${name}`;

	try {
		await mongoose.connect(uri);
		console.info('😻 DB server: connected ✅');
	} catch (error) {
		console.error('❌ DB server: Failed \n', error.message);
		throw new Error(error.message);
	}
};
