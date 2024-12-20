export class APIFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		// Basic filtering
		const queryObj = { ...this.queryString };
		const excludedFields = ['page', 'limit', 'sort', 'fields'];
		excludedFields.forEach(field => delete queryObj[field]);

		// Advanced filtering
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

		this.query = this.query.find(JSON.parse(queryStr));

		return this;
	}

	sort() {
		// Sorting
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createdAt');
		}

		return this;
	}

	fields(...fields) {
		let fieldList;

		if (this.queryString.fields)
			fieldList = [...this.queryString.fields.split(','), ...fields];
		else fieldList = fields.length ? fields : ['-__v'];

		// Array to space-separated string
		this.query = this.query.select(fieldList.join(' '));

		return this;
	}

	paginate() {
		// Pagination
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 100;
		const step = (page - 1) * limit;

		this.query = this.query.skip(step).limit(limit);

		return this;
	}
}
