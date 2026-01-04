import { expect, test } from '@playwright/test';
import { TestUtility } from './utility';

const navLinks = [
  { name: 'TODO', testId: 'nav-todo' },
  { name: '英単語', testId: 'nav-vocabulary', url: '/vocabulary' },
  {
    name: '英単語クイズ',
    testId: 'nav-vocabulary-quiz',
    url: '/vocabulary-quiz',
  },
  { name: '英語の名言', testId: 'nav-quotes', url: '/quotes' },
  { name: 'トリビア', testId: 'nav-trivia', url: '/trivia' },
];

test.describe('各ページの共通部分のテスト', (): void => {
  test.beforeEach(TestUtility.setupNavigation('/'));

  test.describe('DOMが正しく表示されるか', (): void => {
    test('タイトル', async ({ page }): Promise<void> => {
      await expect(
        page.getByRole('heading', {
          name: 'Angular2をキャッチアップするために作った簡易的なアプリケーション',
          level: 1,
        })
      ).toBeVisible();
    });

    test.describe('グローバルナビゲーション', (): void => {
      navLinks.forEach(({ name, testId }): void => {
        test(name, async ({ page }): Promise<void> => {
          await expect(page.getByTestId(testId)).toBeVisible();
        });
      });
    });

    test.describe('天気予報が取得できているか', (): void => {
      const weatherElements = [
        { name: '天気アイコン', testId: 'weather-icon' },
        { name: '気温', testId: 'weather-temperature' },
        { name: '湿度', testId: 'weather-humidity' },
        { name: '降水量', testId: 'weather-rain' },
      ];

      weatherElements.forEach(({ name, testId }): void => {
        test(name, async ({ page }): Promise<void> => {
          await TestUtility.waitForSection(page, 'weather-section');
          await expect(page.getByTestId(testId)).toBeVisible();
        });
      });
    });

    test.describe('名言が取得できているか', (): void => {
      const quoteElements = [
        { name: '名言テキスト', testId: 'quote-text' },
        { name: '著者名', testId: 'quote-author' },
      ];

      quoteElements.forEach(({ name, testId }): void => {
        test(name, async ({ page }): Promise<void> => {
          await TestUtility.waitForSection(page, 'quote-section');
          await expect(page.getByTestId(testId)).toBeVisible();
        });
      });
    });
  });

  test.describe('リンクが機能しているか', (): void => {
    navLinks.forEach(({ name, testId, url }): void => {
      if (!url) return;

      test(`${name}ページに遷移できるか`, async ({ page }): Promise<void> => {
        await page.getByTestId(testId).click();
        await expect(page).toHaveURL(url);
      });
    });
  });
});
