describe('Filter search workflows', () => {
  it('Search within checkbox filter', async () => {
    await filterPanel.getSearchBox();
    await page.getByRole('button').click();
  });
});
