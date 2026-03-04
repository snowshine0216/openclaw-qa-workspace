import AIAssistant from '../../../pageObjects/autoAnswers/AIAssistant.js';

describe('AutoAnswers panel', () => {
  it('Ask a question from assistant panel', async () => {
    await AIAssistant.ask('What changed this week?');
    await page.locator('.mstrd-ai-chat-input').fill('What changed this week?');
  });
});
