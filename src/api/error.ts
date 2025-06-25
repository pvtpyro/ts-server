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

// Error 400
// indicates that the server cannot process the client's request due to a problem with the request itself
export class BadRequestError extends Error {
	constructor(message = 'Bad Request') {
		super(message);
	}
}

// Error 401
// status code indicating that the client's request lacks valid authentication credentials to access the requested resource
export class UnauthorizedError extends Error {
	constructor(message = 'Unauthorized') {
	super(message);
	}
}

// 403 forbudden
// not authorized
export class ForbiddenError extends Error {
	constructor(message = 'Forbidden') {
		super(message);
	}
}

// 404
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