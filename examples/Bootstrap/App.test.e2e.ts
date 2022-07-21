/* eslint-disable jest/no-standalone-expect */

import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080');
});

test('john/123456/12345', async ({ page }) => {
  const username = page.locator('input[name=username]');
  await username.fill('john');
  await page.waitForSelector('input[name=username] ~ span[data-feedback].invalid-feedback');
  const usernameFeedbacks = page.locator('input[name=username] ~ span[data-feedback]');
  await expect(usernameFeedbacks).toHaveCount(1);
  expect(usernameFeedbacks.nth(0)).toHaveText('Username already taken, choose another');

  const password = page.locator('input[name=password]');
  await password.fill('123456');
  await page.waitForSelector('input[name=password] ~ span[data-feedback]');
  const passwordFeedbacks = page.locator('input[name=password] ~ span[data-feedback]');
  await expect(passwordFeedbacks).toHaveCount(4);
  expect(passwordFeedbacks.nth(0)).toHaveText('Should contain small letters');
  expect(passwordFeedbacks.nth(1)).toHaveText('Should contain capital letters');
  expect(passwordFeedbacks.nth(2)).toHaveText('Should contain special characters');
  expect(passwordFeedbacks.nth(3)).toHaveText('Looks good!');

  const passwordConfirm = page.locator('input[name=passwordConfirm]');
  await passwordConfirm.fill('12345');
  const passwordConfirmFeedbacks = page.locator(
    'input[name=passwordConfirm] ~ span[data-feedback]'
  );
  await expect(passwordConfirmFeedbacks).toHaveCount(1);
  expect(passwordConfirmFeedbacks.nth(0)).toHaveText('Not the same password');

  const signUp = page.locator("'Sign Up'");
  await expect(signUp).toBeDisabled();
});

function indent(text: string, indentation: string) {
  return (
    text
      // [Add a char to the start of each line in JavaScript using regular expression](https://stackoverflow.com/q/11939575)
      .replace(/^/gm, indentation)
      // [Trim trailing spaces before newlines in a single multi-line string in JavaScript](https://stackoverflow.com/q/5568797)
      .replace(/[^\S\n]+$/gm, '')
  );
}

test('jimmy/12345/12345', async ({ page }) => {
  const username = page.locator('input[name=username]');
  await username.fill('jimmy');
  await page.waitForSelector('input[name=username] ~ span[data-feedback].valid-feedback');
  const usernameFeedbacks = page.locator('input[name=username] ~ span[data-feedback]');
  await expect(usernameFeedbacks).toHaveCount(2);
  expect(usernameFeedbacks.nth(0)).toHaveText('Username available');
  expect(usernameFeedbacks.nth(1)).toHaveText('Looks good!');

  const password = page.locator('input[name=password]');
  await password.fill('12345');
  await page.waitForSelector('input[name=password] ~ span[data-feedback]');
  const passwordFeedbacks = page.locator('input[name=password] ~ span[data-feedback]');
  await expect(passwordFeedbacks).toHaveCount(4);
  expect(passwordFeedbacks.nth(0)).toHaveText('Should contain small letters');
  expect(passwordFeedbacks.nth(1)).toHaveText('Should contain capital letters');
  expect(passwordFeedbacks.nth(2)).toHaveText('Should contain special characters');
  expect(passwordFeedbacks.nth(3)).toHaveText('Looks good!');

  const passwordConfirm = page.locator('input[name=passwordConfirm]');
  await passwordConfirm.fill('12345');
  const passwordConfirmFeedbacks = page.locator(
    'input[name=passwordConfirm] ~ span[data-feedback]'
  );
  await expect(passwordConfirmFeedbacks).toHaveCount(1);
  expect(passwordConfirmFeedbacks.nth(0)).toHaveText('Looks good!');

  const signUp = page.locator("'Sign Up'");
  await expect(signUp).toBeEnabled();

  page.on('dialog', async dialog => {
    expect(indent(dialog.message(), '    ')).toEqual(`\
    Valid form

    inputs =
    {
      "username": "jimmy",
      "password": "12345",
      "passwordConfirm": "12345"
    }`);
    await dialog.accept();
  });
  await signUp.click();
});
