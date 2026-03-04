import AIBotChatPanel from '../../../pageObjects/aibot/AIBotChatPanel.js';

describe('Bot chat panel', () => {
  it('Send bot message', async () => {
    await AIBotChatPanel.sendMessage('hello');
    await page.locator('.mstrd-bot-send-btn').click();
  });
});
