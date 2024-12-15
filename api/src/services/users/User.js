import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			required: [true, 'Please tell us your first name!'],
		},
		lastname: {
			type: String,
			required: [true, 'Please tell us your last name!'],
		},
		email: {
			type: String,
			required: [true, 'Please provide your email'],
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, 'Please provide a valid email'],
		},
		photo: { type: String, default: 'default.jpg' },
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
		password: {
			type: String,
			required: [true, 'Please provide a password'],
			minlength: 8,
			select: false,
		},
		confirmPassword: {
			type: String,
			required: [true, 'Please confirm your password'],
			validate: {
				// This only works on CREATE and SAVE!!!
				validator: function (input) {
					return input === this.password;
				},
				message: 'Passwords do not match!',
			},
		},
		passwordUpdated: { type: Date, select: false },
		token: String,
		tokenExpiration: Date,
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
	},
	{
		timestamps: true,
	}
);

// Hash user password before saving to database
userSchema.pre('save', async function (next) {
	// Only run if password was actually modified
	if (!this.isModified('password')) return next();

	// Hash with cost of 12
	this.password = await bcrypt.hash(this.password, 12);

	// Delete passwordConfirm field
	delete this.confirmPassword;
	next();
});

// Update passwordUpdated field when password is changed
userSchema.pre('save', async function (next) {
	// Only run if password was actually modified
	if (!this.isModified('password') || this.isNew) return next();
	this.passwordUpdated = Date.now() - 1000;
	next();
});

// Query for active users only
userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

// Compare entered password with hashed password in database
userSchema.methods.isMatched = async function (input) {
	return await bcrypt.compare(input, this.password);
};

// Check if password was changed after JWT was issued
userSchema.methods.isChanged = function (timestamp) {
	if (this.passwordUpdated) {
		const updated = parseInt(this.passwordUpdated.getTime() / 1000, 10);

		return timestamp < updated;
	}

	// False means NOT changed
	return false;
};

// Generate password reset token
userSchema.methods.resetToken = function () {
	const t = crypto.randomBytes(32).toString('hex');

	this.token = crypto.createHash('sha256').update(t).digest('hex');
	this.tokenExpiration = Date.now() + 10 * 60 * 1000;

	return t;
};

const User = mongoose.model('User', userSchema);

export default User;
