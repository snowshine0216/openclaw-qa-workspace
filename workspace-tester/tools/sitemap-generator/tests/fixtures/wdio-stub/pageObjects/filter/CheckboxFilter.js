class CheckboxFilter extends BaseContainer {
  root() {
    return this.$('.mstrd-CheckboxFilter');
  }

  getSearchBox() {
    return this.$('.mstrd-FilterSearch');
  }

  getApplyButton() {
    return this.$('.mstrd-Apply-btn');
  }

  async searchElement(text) {
    await this.getSearchBox().setValue(text);
  }

  async applyFilter() {
    await this.getApplyButton().click();
  }
}

export default new CheckboxFilter();
