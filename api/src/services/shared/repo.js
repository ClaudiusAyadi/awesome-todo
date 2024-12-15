/**
 * Creates a new document.
 * @template T - The type of the Mongoose document.
 * @param {Partial<T>} data - The new document to insert to the database.
 * @returns {Promise<T>} - The created document.
 */
export const create = async (Model, data) => await Model.create(data);

/**
 * Retrieves all documents that match the filter.
 * @template T - The type of the Mongoose document.
 * @param {object} [filter={}] - The filter criteria.
 * @param {object} [fields={}] - The fields to include or exclude.
 * @param {object} [options={}] - Additional query options.
 * @returns {Promise<T[]>} - An array of matching documents.
 */
export const getAll = async (Model, filter = {}, fields = {}, options = {}) =>
	await Model.find(filter, fields, options);

/**
 * Retrieves a single document by its ID.
 * @template T - The type of the Mongoose document.
 * @param {string} id - The ID of the document to retrieve.
 * @param {object} [fields={}] - The fields to include or exclude.
 * @param {object} [options={}] - Additional query options.
 * @returns {Promise<T | null>} - The matching document, or null if not found.
 */
export const getById = async (Model, id, fields = {}, options = {}) =>
	await Model.findById(id, fields, options);

/**
 * Updates a document by its ID.
 * @template T - The type of the Mongoose document.
 * @param {string} id - The ID of the document to update.
 * @param {Partial<T>} data - The updated data.
 * @param {object} [options={ new: true, runValidators: true }] - Additional query options.
 * @returns {Promise<T | null>} - The updated document, or null if not found.
 */
export const update = async (
	Model,
	id,
	data,
	options = { new: true, runValidators: true }
) => await Model.findByIdAndUpdate(id, data, options);

/**
 * Deletes a document by its ID.
 * @template T - The type of the Mongoose document.
 * @param {string} id - The ID of the document to delete.
 * @returns {Promise<T | null>} - The deleted document, or null if not found (since it's been deleted).
 */
export const remove = async (Model, id) => await Model.findByIdAndDelete(id);
