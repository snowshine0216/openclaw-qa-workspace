#!/usr/bin/env node

const assert = require('node:assert/strict');

const {
  markdownToADF,
  buildCommentPayload,
} = require('../scripts/lib/jira-payloads');

const headingDoc = markdownToADF('# RCA Summary\n\nThis is **important**.');
assert.equal(headingDoc.type, 'doc');
assert.equal(headingDoc.version, 1);
assert.equal(headingDoc.content[0].type, 'heading');
assert.equal(headingDoc.content[1].type, 'paragraph');

const codeDoc = markdownToADF('```js\nconst x = 1;\n```');
assert.equal(codeDoc.content[0].type, 'codeBlock');
assert.equal(codeDoc.content[0].attrs.language, 'js');

const commentPayload = buildCommentPayload({
  text: 'Executive summary is ready.',
  mentions: [
    { id: 'acct-1', text: '@Liz Hu' },
    { id: 'acct-2', text: '@Owner' },
  ],
});

assert.equal(commentPayload.body.type, 'doc');
assert.equal(commentPayload.body.content[0].type, 'paragraph');
assert.equal(commentPayload.body.content[0].content[0].type, 'mention');
assert.equal(commentPayload.body.content[0].content[1].type, 'text');
assert.equal(commentPayload.body.content[0].content[2].type, 'mention');
assert.equal(commentPayload.body.content[0].content[3].type, 'text');

console.log('jira payload unit tests passed');
