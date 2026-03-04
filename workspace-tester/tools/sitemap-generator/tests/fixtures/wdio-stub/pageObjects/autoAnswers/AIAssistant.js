class AIAssistant {
  getChatInput() {
    return this.$('.mstrd-ai-chat-input');
  }

  async ask(question) {
    await this.getChatInput().setValue(question);
  }
}

export default new AIAssistant();
