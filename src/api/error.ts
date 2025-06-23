// class HttpError extends Error {
// 	constructor(statusCode, message, data = {}) {
// 		super(message);
// 		this.statusCode = statusCode;
// 		this.data = data;
// 		// Ensure the name of the class is correctly set
// 		this.name = this.constructor.name;
// 		// Capture stack trace in V8
// 		if (typeof Error.captureStackTrace === 'function') {
// 			Error.captureStackTrace(this, this.constructor);
// 		} else {
// 			this.stack = (new Error(message)).stack;
// 		}
// 	}
// }

export class BadRequestError extends Error {
	constructor(message = 'Bad Request') {
		super(message);
	}
}

export class UnauthorizedError extends Error {
	constructor(message = 'Unauthorized') {
	super(message);
	}
}

export class ForbiddenError extends Error {
	constructor(message = 'Forbidden') {
		super(message);
	}
}

export class NotFoundError extends Error {
	constructor(message = 'Not Found') {
		super(message);
	}
}


// module.exports = {
// 	BadRequestError,
// 	UnauthorizedError,
// 	ForbiddenError,
// 	NotFoundError,
// };