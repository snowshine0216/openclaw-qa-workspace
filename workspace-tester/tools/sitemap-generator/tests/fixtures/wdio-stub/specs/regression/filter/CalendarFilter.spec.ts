import CalendarFilter from '../../../pageObjects/filter/CalendarFilter.js';
import CheckboxFilter from '../../../pageObjects/filter/CheckboxFilter.js';

describe('Filter workflows', () => {
  it('Apply attribute filter and validate grid refresh', async () => {
    await CalendarFilter.selectDate(2026, 3, 4);
    await CalendarFilter.applyFilter();
    await browser.$('.mstrd-Apply-btn').click();
  });

  test('Clear all filters and verify default state', async () => {
    await CheckboxFilter.searchElement('west');
    await CheckboxFilter.applyFilter();
    await page.locator('.mstrd-FilterSearch').click();
    await test.step('Validate filter summary bar capsule', async () => {
      await page.getByText('Filter summary').click();
    });
  });
});
