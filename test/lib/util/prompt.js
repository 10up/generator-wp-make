import {assert} from 'chai';
import prompt from '../../../lib/util/prompt';

describe('lib > util > prompt', function () {
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
			const context = {};
			const mockQuestions = [
				{
					name:    'question1',
					message: 'Question 1'
				},
				{
					name:    'question2',
					message: 'Question 2'
				},
				{
					name:    'question3',
					message: 'Question3'
				},
			];
			// Mocks the call to the yeoman prompt prototype.
			function mockPrompt( question ) {
				// Increment call count.
				count++;
				// Check to ensure we got passed the question object.
				assert.equal( question, mockQuestions[count] );
				// Check to ensure context is set to the generator.
				assert.equals(this, context);
				// return the incremented answer.
				return `answer${count}`;
			}
			prompt.prompt.call( context, mockQuestions, {}, mockPrompt )
				.then((answers) => (
					assert.isTrue(answers);
				));
		});
	})
});
