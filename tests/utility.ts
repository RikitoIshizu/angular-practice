import { PagePath } from '@/types';
import { Page } from '@playwright/test';

export class TestUtility {
  // 特定のページに遷移するヘルパー関数
  static async navigateTo(page: Page, path: PagePath): Promise<void> {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
  }

  // beforeEachで使いやすいセットアップ関数
  static setupNavigation(path: PagePath) {
    return async ({ page }: { page: Page }): Promise<void> => {
      await this.navigateTo(page, path);
    };
  }

  // セクションの表示を待つヘルパー関数
  static async waitForSection(page: Page, sectionId: string): Promise<void> {
    await page.waitForSelector(`[data-testid="${sectionId}"]`, {
      state: 'visible',
    });
  }
}
