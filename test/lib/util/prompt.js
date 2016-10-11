import {assert} from 'chai';
import prompt from '../../../lib/util/prompt';

describe('lib > util > prompt', function () {
	beforeEach(function () {
		prompt._makeProfile = {};
	});
	after(function () {
		delete prompt._makeProfile;
	});
	/**
	 * Confirm the file is loading correctly and tested functions are available
	 */
	describe('Setup', function () {
		it('can be imported', function () {
			assert.isOk(prompt, 'prompt is available');
		});
		it('functions exist', function () {
			assert.isFunction(prompt.prompt, 'prompt.prompt is a function');
		});
	});
	describe('the prompt method will compile question answers', function () {
		it('runs each question individually, gathering answers', function() {
			let count = 0;
			const mockQuestions = [
				{
					name: 'question1',
					message: 'Question 1'
				},
				{
					name: 'question2',
					message: 'Question 2'
				},
				{
					name: 'question3',
					message: 'Question 3'
				},
			];
			// Mocks the call to the yeoman prompt prototype.
			function mockPrompt( question ) {
				// Check to ensure we got passed the question object.
				assert.equal( question, mockQuestions[count] );
				// Increment call count.
				count++;
				// return the incremented answer.
				return new Promise( resolve => resolve( {
					[question.name]: `answer${count}`
				} ) );
			}
			return prompt.prompt( [...mockQuestions], undefined, mockPrompt )
				.then(answers => {
					// mockPrompt should have been called 3 times.
					assert.equal( count, 3 );
					// it should have compiled all 3 answers into an object
					assert.deepEqual( answers, {
						question1: 'answer1',
						question2: 'answer2',
						question3: 'answer3'
					});
				});
		});
		it('will follow trees deeply', function() {
			let count = 0;
			const mockQuestions = [
				{
					name: 'question1',
					message: 'Question 1',
					tree: {
						answer1: [{
							name: 'question2',
							message: 'Question 2',
							tree: {
								answer2: [{
									name: 'question3',
									message: 'Question 3',
									tree: {
										answer3: [{
											name: 'question4',
											message: 'Question 4'
										}]
									}
								}]
							}
						}]
					}
				},
				{
					name: 'question5',
					message: 'Question 5'
				}
			];
			// Mocks the call to the yeoman prompt prototype.
			function mockPrompt( question ) {
				// Increment call count.
				count++;
				// return the incremented answer.
				return new Promise( resolve => resolve( {
					[question.name]: `answer${count}`
				} ) );
			}
			return prompt.prompt( mockQuestions, undefined, mockPrompt )
				.then(answers => {
					// mockPrompt should have been called 3 times.
					assert.equal( count, 5 );
					// it should have compiled all 5 answers into an object
					assert.deepEqual( answers, {
						question1: 'answer1',
						question2: 'answer2',
						question3: 'answer3',
						question4: 'answer4',
						question5: 'answer5'
					});
				});
		});
		it('will not follow trees that don\'t match the answer', function() {
			const mockQuestions = [
				{
					name: 'question1',
					message: 'Question 1',
					tree: {
						nottheanswer: [{
							name: 'norunQuestion',
							message: 'Should Not Run'
						}]
					}
				},
				{
					name: 'question2',
					message: 'Question 2'
				}
			];
			// Mocks the call to the yeoman prompt prototype.
			function mockPrompt( question ) {
				// return the incremented answer.
				return new Promise( resolve => resolve( {
					[question.name]: 'answer'
				} ) );
			}
			return prompt.prompt( mockQuestions, {}, mockPrompt )
				.then(answers => {
					// only should have two answers back, no tree followed.
					assert.deepEqual( answers, {
						question1: 'answer',
						question2: 'answer'
					});
				});
		});
		it('will stringify non-string tree answers', function() {
			let count = 0;
			const mockQuestions = [
				{
					name: 'question1',
					message: 'Question 1',
					tree: {
						true: [{
							name: 'question2',
							message: 'Question 2'
						}]
					}
				}
			];
			// Mocks the call to the yeoman prompt prototype.
			function mockPrompt( question ) {
				// Increment call count.
				count++;
				// return the incremented answer.
				return new Promise( resolve => resolve( {
					[question.name]: true
				} ) );
			}
			return prompt.prompt( mockQuestions, {}, mockPrompt )
				.then(answers => {
					// mockPrompt should have been called 2 times.
					assert.equal( count, 2 );
					// should have two answers, both true.
					assert.deepEqual( answers, {
						question1: true,
						question2: true
					});
				});
		});
		it('will accept seed objects as needed', function() {
			const mockQuestions = [
				{
					name: 'question1',
					message: 'Question 1'
				},
				{
					name: 'question2',
					message: 'Question 2'
				}
			];
			// Mocks the call to the yeoman prompt prototype.
			function mockPrompt( question ) {
				// return the incremented answer.
				return new Promise( resolve => resolve( {
					[question.name]: 'answer'
				} ) );
			}
			return prompt.prompt( mockQuestions, { test: 'test' }, mockPrompt )
				.then(answers => {
					// Check to make sure we got both questions and the seed.
					assert.deepEqual( answers, {
						test: 'test',
						question1: 'answer',
						question2: 'answer'
					});
				});
		});
		it('mixes the profile object into the seed object', function () {
			prompt._makeProfile = {
				blue: 'green',
				test: 'override seed'
			};
			const mockQuestions = [
				{
					name: 'question1',
					message: 'Question 1'
				},
				{
					name: 'question2',
					message: 'Question 2'
				}
			];
			// Mocks the call to the yeoman prompt prototype.
			function mockPrompt( question ) {
				// return the incremented answer.
				return new Promise( resolve => resolve( {
					[question.name]: 'answer'
				} ) );
			}
			return prompt.prompt( mockQuestions, { test: 'test' }, mockPrompt )
				.then(answers => {
					// Check to make sure we got both questions and the seed.
					assert.deepEqual( answers, {
						blue: 'green',
						test: 'override seed',
						question1: 'answer',
						question2: 'answer'
					});
				});
		});
		it('can override defaults with profile if specified', function () {
			prompt._makeProfile = {
				question1: 'newdefault1',
				question2: 'newdefault2'
			};
			const mockQuestions = [
				{
					name: 'question1',
					message: 'Question 1',
					default: 'answer1',
					profile: 'default'
				},
				{
					name: 'question2',
					message: 'Question 2',
					default: 'answer2'
				}
			];
			// Mocks the call to the yeoman prompt prototype.
			function mockPrompt( question ) {
				// return the incremented answer.
				return new Promise( resolve => resolve( {
					[question.name]: question.default
				} ) );
			}
			return prompt.prompt( mockQuestions, {}, mockPrompt )
				.then(answers => {
					// Check to make sure we got both questions and the seed.
					assert.deepEqual( answers, {
						question1: 'newdefault1',
						question2: 'answer2'
					});
				});
		});
		it('can override questions entirely if specified', function () {
			let count = 0;
			prompt._makeProfile = {
				question1: 'override1',
				question2: 'override2'
			};
			const mockQuestions = [
				{
					name: 'question1',
					message: 'Question 1',
					profile: 'override'
				},
				{
					name: 'question2',
					message: 'Question 2',
				}
			];
			// Mocks the call to the yeoman prompt prototype.
			function mockPrompt( question ) {
				// Increment call count.
				count++;
				// return the incremented answer.
				return new Promise( resolve => resolve( {
					[question.name]: 'answer'
				} ) );
			}
			return prompt.prompt( mockQuestions, {}, mockPrompt )
				.then(answers => {
					// Check to make sure mockPrompt was only called onced.
					assert.equal( count, 1 );
					// Check to make sure we got both questions and the seed.
					assert.deepEqual( answers, {
						question1: 'override1',
						question2: 'answer'
					});
				});
		});
		it('can make hidden questions questions asked', function () {
			let count = 0;
			prompt._makeProfile = {
				question1: '__prompt',
				question2: 'auto2'
			};
			const mockQuestions = [
				{
					name: 'question1',
					message: 'Question 1',
					profile: 'hidden'
				},
				{
					name: 'question2',
					message: 'Question 2',
					profile: 'hidden'
				},
				{
					name: 'question3',
					message: 'Question 3',
					profile: 'hidden'
				},
				{
					name: 'question4',
					message: 'Question 4',
					profile: 'hidden'
				}
			];
			// Mocks the call to the yeoman prompt prototype.
			function mockPrompt( question ) {
				// Increment call count.
				count++;
				// return the incremented answer.
				return new Promise( resolve => resolve( {
					[question.name]: 'answer'
				} ) );
			}
			return prompt.prompt( mockQuestions, { question3: 'auto3'}, mockPrompt )
				.then(answers => {
					// Check to make sure mockPrompt was only called onced.
					assert.equal( count, 1 );
					// Check to make sure we got both questions and the seed.
					assert.deepEqual( answers, {
						question1: 'answer',
						question2: 'auto2',
						question3: 'auto3',
						question4: undefined
					});
				});
		});
		it('runs the prompt function with the right context', function() {
			const context = {};
			const mockQuestions = [{
				name: 'question1',
				message: 'Question 1'
			}];
			// Mocks the call to the yeoman prompt prototype.
			function mockPrompt( question ) {
				// Check to ensure context is set to the generator.
				assert.equal(this, context);
				// return the incremented answer.
				return new Promise( resolve => resolve( {
					[question.name]: 'answer'
				} ) );
			}
			return prompt.prompt.call( context, mockQuestions, undefined, mockPrompt )
				.then(answers => {
					// double check we got the expected answer object
					assert.deepEqual( answers, { question1: 'answer' } );
				});
		});
		it('has access to a default prompt function', function () {
			// This borders more on an integration test but is still worth it.

			// Mock a bit of the yeoman environment context so that the
			// actual prompt method doesn't throw a fit when run.
			const context = {
				options: {},
				_globalConfig: {
					get: () => ( {} )
				},
				env: {
					adapter: {
						prompt: () => new Promise( resolve => resolve( {
							question1: 'answer'
						} ) )
					}
				}
			};
			// Singular mock question for simplicty
			const mockQuestions = [{
				name: 'question1',
				message: 'Question 1'
			}];
			// Run it and verify.
			return prompt.prompt.call( context, mockQuestions )
				.then(answers => {
					// it should have sent our answer back
					assert.deepEqual( answers, { question1: 'answer' } );
				});
		});
	});
});
