import type { Page } from '@playwright/test';
import { getReportEnv } from '../../config/env';

export class LibraryPage {
  constructor(private readonly page: Page) {}

  private getBaseUrl(): string {
    const env = getReportEnv();
    return env.reportTestUrl || '/';
  }

  /** Logout by navigating to logout URL */
  async logout(): Promise<void> {
    const base = this.getBaseUrl();
    if (!base || base === '/') return;
    const logoutUrl = base.endsWith('/') ? `${base}logout` : `${base}/logout`;
    await this.page.goto(logoutUrl, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  async openDefaultApp(): Promise<void> {
    if (!this.page) return;
    const base = this.getBaseUrl();
    if (!base || base === '/') return;
    const url = base.endsWith('/') ? `${base}app` : `${base}/app`;
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await this.handleError();
  }

  async handleError(): Promise<void> {
    if (!this.page) return;
    // Dismiss error dialogs if present (Library/Mojo style)
    const okBtn = this.page.getByRole('button', { name: /^(OK|ok|Ok)$/ }).first();
    const closeBtn = this.page.getByRole('button', { name: /close|dismiss/i }).first();
    try {
      const visible = await okBtn.isVisible().catch(() => false);
      if (visible) await okBtn.click({ timeout: 3000 });
    } catch {
      // ignore
    }
    try {
      const visible = await closeBtn.isVisible().catch(() => false);
      if (visible) await closeBtn.click({ timeout: 3000 });
    } catch {
      // ignore
    }
  }

  async editReportByUrl(params: { dossierId: string; projectId: string }): Promise<void> {
    const base = this.getBaseUrl();
    if (!base || base === '/') {
      throw new Error('reportTestUrl not set. Configure tests/config/.env.report with reportTestUrl.');
    }
    const path = `app/${params.projectId}/${params.dossierId}/edit`;
    const url = base.endsWith('/') ? `${base}${path}` : `${base}/${path}`;
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await this.handleError();
    // Wait for report editor and dataset panel to be ready
    await this.page.waitForSelector('.report-editor-dataset, .report-objects, .dataset-panel', { timeout: 45000 }).catch(() => {});
    await this.page.waitForTimeout(1500);
  }

  /** Create new report from template (WDIO: createNewReportByUrl) */
  async createNewReportByUrl(params: { projectId?: string } = {}): Promise<void> {
    const base = this.getBaseUrl();
    if (!base || base === '/') {
      throw new Error('reportTestUrl not set. Configure tests/config/.env.report with reportTestUrl.');
    }
    const projectId = params.projectId ?? 'B628A31F11E7BD953EAE0080EF0583BD';
    const path = `app/${projectId}/05B202B9999F4C1AB960DA6208CADF3D/K53--K46/edit?isNew=true&continue`;
    const url = base.endsWith('/') ? `${base}${path}` : `${base}/${path}`;
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await this.handleError();
    await this.page.waitForSelector('.report-editor-dataset, .report-objects, .dataset-panel', { timeout: 45000 }).catch(() => {});
    await this.page.waitForTimeout(1500);
  }

  async openReportByUrl(params: {
    projectId: string;
    documentId?: string;
    dossierId?: string;
    prompt?: boolean;
  }): Promise<void> {
    const base = this.getBaseUrl();
    if (!base || base === '/') return;
    const id = params.dossierId || params.documentId || '';
    const path = `app/${params.projectId}/${id}`;
    const url = base.endsWith('/') ? `${base}${path}` : `${base}/${path}`;
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.handleError();
    // Wait for report/content to render (consumption view)
    await this.page.waitForSelector('.mstrmojo-ReportPageBySelector, .ag-root, [role="grid"], [class*="report"]', {
      timeout: 30000,
    }).catch(() => {});
    await this.page.waitForTimeout(3000);
  }
}
