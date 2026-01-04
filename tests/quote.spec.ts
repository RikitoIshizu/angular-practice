import { expect, test } from '@playwright/test';

test.describe('英語の名言ページのテスト', () => {
  test.describe('DOMが正しく表示されるか', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/quotes');
    });

    test('H2タイトル', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: '英語の名言', level: 2 })
      ).toBeVisible();
    });

    test('ボタン名', async ({ page }) => {
      await expect(
        page.getByRole('button', { name: /名言を取得する/ })
      ).toBeVisible();
    });
  });
});
