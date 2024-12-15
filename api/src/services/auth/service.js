import { AppError } from '../../libraries/errors/index.js';
import { asyncHandler } from '../../libraries/utils/index.js';
import { promisify } from 'util';
import c from '../../libraries/config/index.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../users/User.js';

const signToken = id =>
	jwt.sign({ id }, c.jwt.secret, {
		expiresIn: c.jwt.expiration,
	});

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user.id);
	const cookieOptions = {
		expires: new Date(Date.now() + c.jwt.expiration),
		secure: c.mode.live,
		httpOnly: true,
	};

	res.cookie(c.api.name, token, cookieOptions);

	// Remove these fields from response
	delete user.password;
	delete user.active;

	res.status(statusCode).json({
		status: 'success',
		code: statusCode,
		token,
		user,
	});
};

export const signup = asyncHandler(async (req, res, next) => {
	// Get user data from the request body
	const newUser = await User.create({
		username: req.body.username,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
	});

	// const url = `${req.protocol}://${req.get('host')}/account`;

	// await new Email(newUser, url).sendWelcome();

	// Sign token & send data
	createSendToken(newUser, 201, res);
});

export const signin = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// 1. Check if email and password exist
	if (!email || !password)
		return next(new AppError('Please provide an email and password.', 400));

	// 2. Check if email and password are valid
	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.isMatched(password)))
		return next(new AppError('Incorrect email or password.', 401));

	// 3. Login the user
	createSendToken(user, 200, res);
});

export const signout = (req, res) => {
	// Jonas method
	// res.cookie('jwt', 'loggedOut', {
	// 	expires: new Date(Date.now() + 10 * 1000),
	// 	httpOnly: true,
	// });

	// My way
	res.clearCookie('jwt');

	res.status(200).json({ status: 'success' });
};

export const protect = asyncHandler(async (req, res, next) => {
	// 1. Get token and confirm it exists
	let token;
	if (req.cookies.jwt) token = req.cookies.jwt;

	if (!token)
		return next(
			new AppError('Not Authorized: Please log in to gain access!', 401)
		);

	// 2. Verify token (2 possible errors - invalid and expired tokens)
	const decoded = await promisify(jwt.verify)(token, c.jwt.secret);

	// 3. Check if user still exists
	const currentUser = await User.findById(decoded.id);
	if (!currentUser)
		return next(
			new AppError('The user with this access token does no longer exist.', 401)
		);

	// 4. Check if user changed password after token was issued
	if (currentUser.isChanged(decoded.iat)) {
		return next(
			new AppError(
				'User recently changed password! Please log in with the correct password.',
				401
			)
		);
	}

	// 5. Grant access to protected router
	req.user = currentUser;
	res.locals.user = currentUser;
	next();
});

export const isLoggedIn = async (req, res, next) => {
	// 1. Verify cookies
	if (req.cookies.jwt) {
		try {
			const decoded = await promisify(jwt.verify)(
				req.cookies.jwt,
				c.jwt.secret
			);

			// 2. Check if user still exists
			const currentUser = await User.findById(decoded.id);
			if (!currentUser) return next();

			// 3. Check if user changed password after token was issued
			if (currentUser.isChanged(decoded.iat)) {
				return next();
			}

			// THERE IS A LOGGED IN USER
			res.user = currentUser;
			res.locals.user = currentUser;
			return next();
		} catch (err) {
			return next();
		}
	}

	return next();
};

export const restrictTo =
	(...roles) =>
	(req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError(
					'You do not have the permission to perform this action',
					403
				)
			);
		}
		next();
	};

export const forgotPassword = asyncHandler(async (req, res, next) => {
	// 1. Check if user email exists
	const user = await User.findOne({ email: req.body.email });

	if (!user)
		return next(new AppError('There is no user with that email.', 404));

	// 2. Generate random token
	const resetToken = user.resetToken();
	await user.save({ validateBeforeSave: false });

	// 3. Send email with token
	try {
		const url = `${req.protocol}://${req.get(
			'host'
		)}/api/v1/users/resetPassword/${resetToken}`;

		await new Email(user, url).sendPasswordReset();

		res.status(200).json({
			status: 'success',
			message: 'Password reset link sent to your email.',
		});
	} catch (err) {
		user.token = undefined;
		user.tokenExpiration = undefined;
		await user.save({ validateBeforeSave: false });
		return next(new AppError(err, 500));
	}
});

export const resetPassword = asyncHandler(async (req, res, next) => {
	// 1. Find user based on reset token
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await User.findOne({
		token: hashedToken,
		tokenExpiration: { $gt: Date.now() },
	});

	// 2. Token not expired and user exists, change password
	if (!user)
		return next(
			new AppError('Password reset token is invalid or has expired.', 400)
		);

	user.password = req.body.password;
	user.confirmPassword = req.body.confirmPassword;
	user.token = undefined;
	user.tokenExpiration = undefined;
	await user.save();

	// 3. Update changedPasswordAt for user - check User model

	// 4. Log user in
	createSendToken(user, 200, res);
});

export const updatePassword = asyncHandler(async (req, res, next) => {
	// 1. Find user in collection
	const user = await User.findById(req.user.id).select('+password');
	if (!user) return next(new AppError('No user found!', 404));

	// 2. Confirm current password
	if (!(await user.isMatched(req.body.passwordCurrent)))
		return next(new AppError('Your current password is incorrect', 401));

	// 3. Update password
	user.password = req.body.password;
	user.confirmPassword = req.body.confirmPassword;
	await user.save(); // remember pre-save middlewares only work for create() and save()

	// 4. Log user in
	createSendToken(user, 200, res);
});
