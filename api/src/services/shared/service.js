import { asyncHandler, APIFeatures } from '../../libraries/utils/index.js';
import { AppError } from '../../libraries/errors/index.js';

export const getAll = (Model, modelName) =>
	asyncHandler(async (req, res, next) => {
		// Execute query
		const features = new APIFeatures(Model.find(), req.query)
			.filter()
			.sort()
			.fields()
			.paginate();

		// const doc = await features.query.explain();
		const doc = await features.query;

		// SEND RESPONSE
		res.status(200).json({
			status: 'success',
			results: doc.length,
			[modelName]: doc,
		});
	});

export const getById = (Model, modelName, options) =>
	asyncHandler(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		if (options) query = query.populate(options);
		const doc = await query;

		if (!doc)
			return next(
				new AppError(
					`No ${modelName} found with the id of '${req.params.id}'`,
					404
				)
			);

		res.status(200).json({
			status: 'success',
			[modelName]: doc,
		});
	});

export const create = (Model, modelName) =>
	asyncHandler(async (req, res, next) => {
		const doc = await Model.create(req.body);

		res.status(201).json({
			status: 'success',
			[modelName]: doc,
		});
	});

export const update = (Model, modelName) =>
	asyncHandler(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!doc)
			return next(
				new AppError(
					`No ${modelName} found with the id of '${req.params.id}'`,
					404
				)
			);

		res.status(200).json({
			status: 'success',
			[modelName]: doc,
		});
	});

export const remove = (Model, modelName) =>
	asyncHandler(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);

		if (!doc)
			return next(
				new AppError(
					`No ${modelName} found with the id of '${req.params.id}'`,
					404
				)
			);

		res.status(204).json({
			status: 'success',
			message: `${modelName} with the ${req.params.id} deleted successfully`,
		});
	});
