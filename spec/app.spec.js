const app = require('../app');
const request = require('request');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const qs = require('qs');

describe('App', () => {
	const baseUrl = 'http://localhost:8888';
	const apiUrl = baseUrl + '/api/v1/';
	let server;
	let user;
	const apiUrlFor = (type, params) => {
		params = params ? `&${qs.stringify(params)}` : '';
		console.log(`${apiUrl}${type}?access_token=${user.apiToken}${params}`);
		return `${apiUrl}${type}?access_token=${user.apiToken}${params}`;
	};
	const j = str => JSON.parse(str);

	beforeAll(done => {
		server = app.listen(8888, () => {
			done();
		});
	});

	beforeEach(done => {
		User.create({
			fname: 'Foo',
			lname: 'Bar',
			email: 'foobar@gmail',
			password: 'password'
		}).then(result => {
			user = result;
			console.log(user);
			done();
		});
	});

	afterEach(async done => {
		await User.remove({ email: 'foobar@gmail' });
		done();
	});

	afterAll(done => {
		server.close();
		server = null;
		done();
	});

	// ----------------------------------------
	// App
	// ----------------------------------------
	it('renders the home page', done => {
		request.get(baseUrl, (err, res, body) => {
			expect(res.statusCode).toBe(200);
			expect(body).toMatch(/api/i);
			console.log(body);
			done();
		});
	});

	it('returns an array with the given number of nouns from a default', done => {
		request.get(apiUrlFor('nouns'), (err, res, body) => {
			let result = j(body);
			expect(result.length).toEqual(10);
			done();
		});
	});

	it('returns an array with the given number of nouns by param', done => {
		request.get(apiUrlFor('nouns', { count: 8 }), (err, res, body) => {
			let result = j(body);
			expect(result.length).toEqual(8);
			done();
		});
	});

	it('returns an array with the given number of verbs from a default', done => {
		request.get(apiUrlFor('verbs'), (err, res, body) => {
			let result = j(body);
			expect(result.length).toEqual(10);
			done();
		});
	});

	it('returns an array with the given number of verbs by param', done => {
		request.get(apiUrlFor('verbs', { count: 8 }), (err, res, body) => {
			let result = j(body);
			expect(result.length).toEqual(8);
			done();
		});
	});

	it('returns an array with the given number of adverbs from a default', done => {
		request.get(apiUrlFor('adverbs'), (err, res, body) => {
			let result = j(body);
			expect(result.length).toEqual(10);
			done();
		});
	});

	it('returns an array with the given number of adverbs by param', done => {
		request.get(apiUrlFor('adverbs', { count: 8 }), (err, res, body) => {
			let result = j(body);
			expect(result.length).toEqual(8);
			done();
		});
	});

	it('returns an array with the given number of adjectives from a default', done => {
		request.get(apiUrlFor('adjectives'), (err, res, body) => {
			let result = j(body);
			expect(result.length).toEqual(10);
			done();
		});
	});

	it('returns an array with the given number of adjectives by param', done => {
		request.get(apiUrlFor('adjectives', { count: 8 }), (err, res, body) => {
			let result = j(body);
			expect(result.length).toEqual(8);
			done();
		});
	});

	it('does not allow requests without an access_token', done => {
		request.get(apiUrl, (err, res, body) => {
			// Note, this SHOULD have a status code of 401
			// however something is not working right with
			// the Passport HTTP Bearer package in setting
			// the correct status code
			// See Github issue:
			// https://github.com/jaredhanson/passport-http-bearer/issues/11
			expect(res.statusCode).toBe(401);
			done();
		});
	});
});
