class AIAssistant {
  getPromptInput() {
    return this.$('.mstrd-ai-prompt-input');
  }

  async ask(prompt) {
    await this.getPromptInput().setValue(prompt);
  }
}

export default new AIAssistant();
