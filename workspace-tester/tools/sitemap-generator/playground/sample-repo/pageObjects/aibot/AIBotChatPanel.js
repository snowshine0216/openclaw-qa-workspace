class AIBotChatPanel {
  getSendButton() {
    return this.$('.mstrd-bot-send-btn');
  }

  async sendMessage(text) {
    await this.getSendButton().click();
  }
}

export default new AIBotChatPanel();
