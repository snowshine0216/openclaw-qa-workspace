import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, test, type Page } from '@playwright/test';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseFixturePath = path.resolve(projectRoot, 'fixtures/qa_plan_base.md');
const protectedFeatureIds = new Set(['BCIN-6709']);
const fixtureFeatureId = 'BCIN-E2E';
const qaPlanPath = path.resolve(
  projectRoot,
  `workspace/workspace-planner/projects/feature-plan/${fixtureFeatureId}/qa_plan_final.md`,
);

if (protectedFeatureIds.has(fixtureFeatureId)) {
  throw new Error('Fixture feature id must not match protected production-like feature id.');
}

async function resetFixture() {
  const baseline = await readFile(baseFixturePath, 'utf8');
  await writeFile(qaPlanPath, baseline, 'utf8');
}

async function loadFixtureFeature(page: Page) {
  await page.goto('/');
  const loadButton = page.getByRole('button', { name: 'Load' });
  await expect(loadButton).toBeEnabled();
  const featureInput = page.locator('#feature-id');
  await featureInput.click();
  await featureInput.fill(fixtureFeatureId);
  await expect(featureInput).toHaveValue(fixtureFeatureId);
  await loadButton.click();
  await expect(page.locator('.source-path')).toContainText(`${fixtureFeatureId}/qa_plan_final.md`);
}

test.beforeEach(async () => {
  await resetFixture();
});

test('renders xmind hierarchy without duplicate verified-steps layer', async ({ page }) => {
  await loadFixtureFeature(page);

  await expect(page.locator('.category-node .node-title', { hasText: 'Recovery Flow' })).toBeVisible();
  await expect(page.locator('.category-node .node-title', { hasText: 'Prompt Flow' })).toBeVisible();
  await expect(page.locator('.checkpoint-node').first()).toBeVisible();
  await expect(page.locator('.result-node').first()).toBeVisible();
  await expect(page.locator('.step-node')).toHaveCount(0);
  await expect(page.getByText('Verified Steps')).toHaveCount(0);
  await expect(page.locator('.checkpoint-node').first()).toContainText('Open report');
});

test('add behavior and delete cleanup: empty categories are removed', async ({ page }) => {
  await loadFixtureFeature(page);

  await page.locator('.react-flow__pane').click({ position: { x: 20, y: 20 } });
  await expect(page.getByRole('button', { name: 'Add Category' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Category' }).click();

  await expect(page.locator('.category-node .node-title', { hasText: /New Category \d+/ })).toBeVisible();

  await page.locator('.category-node .node-title', { hasText: 'Recovery Flow' }).first().click();
  await expect(page.getByRole('button', { name: 'Add Subtopic' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Subtopic' }).click();

  await expect(page.getByLabel('Test Key Points')).toHaveValue('Step 1: Define the check point');
  await expect(page.locator('label:has-text("Move To Section") select')).toHaveValue(/section-recovery-flow/);

  await page.locator('.react-flow__pane').click({ position: { x: 20, y: 20 } });
  await page.getByRole('button', { name: 'Add Category' }).click();
  const newCategoryTitle = page.locator('.category-node .node-title', { hasText: /New Category \d+/ }).last();
  await expect(newCategoryTitle).toBeVisible();
  const newCategoryName = (await newCategoryTitle.textContent())?.trim();
  expect(newCategoryName).toBeTruthy();
  await page.getByRole('button', { name: 'Delete Case' }).click();
  await expect(page.locator('.category-node .node-title', { hasText: newCategoryName ?? '' })).toHaveCount(0);
});

test('manual save persists editor changes through API', async ({ page }) => {
  await loadFixtureFeature(page);

  const uniqueExpectedResult = `Persisted expected result ${Date.now()}`;

  await page.getByText('Recovery Flow').first().click();
  await page.locator('.checkpoint-node').first().click();
  await page.getByLabel('Expected Results').fill(uniqueExpectedResult);
  await expect(page.locator('.status-text')).toContainText('Unsaved changes. Click Save.');

  const beforeSaveResponse = await page.request.get(`/api/features/${fixtureFeatureId}/test-key-points`);
  const beforeSavePayload = (await beforeSaveResponse.json()) as {
    document: { sections: Array<{ cases: Array<{ expectedResults: string }> }> };
  };
  const hasValueBeforeSave = beforeSavePayload.document.sections.some((section) =>
    section.cases.some((item) => item.expectedResults === uniqueExpectedResult),
  );
  expect(hasValueBeforeSave).toBe(false);

  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('.status-text')).toContainText('Saved.', { timeout: 10000 });

  await expect
    .poll(
      async () => {
        const response = await page.request.get(`/api/features/${fixtureFeatureId}/test-key-points`);
        const payload = (await response.json()) as {
          document: { sections: Array<{ cases: Array<{ expectedResults: string }> }> };
        };

        return payload.document.sections.some((section) =>
          section.cases.some((item) => item.expectedResults === uniqueExpectedResult),
        );
      },
      { timeout: 10000 },
    )
    .toBe(true);
});
