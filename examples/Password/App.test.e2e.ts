/* eslint-disable jest/no-standalone-expect */

import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080');
});

test('john@beatles/123456/12345', async ({ page }) => {
  const email = page.locator('input[name=email]');
  await email.fill('john@beatles');
  await page.waitForSelector('input[name=email] ~ span[data-feedback]');
  const emailFeedbacks = page.locator('input[name=email] ~ span[data-feedback]');
  await expect(emailFeedbacks).toHaveCount(1);
  expect(emailFeedbacks.nth(0)).toHaveText('Looks good!');

  const password = page.locator('input[name=password]');
  await password.fill('123456');
  await page.waitForSelector('input[name=password] ~ span[data-feedback].when-valid');
  const passwordFeedbacks = page.locator('input[name=password] ~ span[data-feedback]');
  expect(passwordFeedbacks).toHaveCount(5);
  expect(passwordFeedbacks.nth(0)).toHaveText('Should contain small letters');
  expect(passwordFeedbacks.nth(1)).toHaveText('Should contain capital letters');
  expect(passwordFeedbacks.nth(2)).toHaveText('Should contain special characters');
  expect(passwordFeedbacks.nth(3)).toHaveText('This password is very common');
  expect(passwordFeedbacks.nth(4)).toHaveText('Looks good!');

  const passwordConfirm = page.locator('input[name=passwordConfirm]');
  await passwordConfirm.fill('12345');
  const passwordConfirmFeedbacks = page.locator(
    'input[name=passwordConfirm] ~ span[data-feedback]'
  );
  expect(passwordConfirmFeedbacks).toHaveCount(1);
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

test('john@beatles/Tr0ub4dor&3/Tr0ub4dor&3', async ({ page }) => {
  const email = page.locator('input[name=email]');
  await email.fill('john@beatles');
  await page.waitForSelector('input[name=email] ~ span[data-feedback]');
  const emailFeedbacks = page.locator('input[name=email] ~ span[data-feedback]');
  expect(emailFeedbacks).toHaveCount(1);
  expect(emailFeedbacks.nth(0)).toHaveText('Looks good!');

  const password = page.locator('input[name=password]');
  await password.fill('Tr0ub4dor&3');
  await page.waitForSelector('input[name=password] ~ span[data-feedback].when-valid');
  const passwordFeedbacks = page.locator('input[name=password] ~ span[data-feedback]');
  expect(passwordFeedbacks).toHaveCount(1);
  expect(passwordFeedbacks.nth(0)).toHaveText('Looks good!');

  const passwordConfirm = page.locator('input[name=passwordConfirm]');
  await passwordConfirm.click();
  await passwordConfirm.fill('Tr0ub4dor&3');
  const passwordConfirmFeedbacks = page.locator(
    'input[name=passwordConfirm] ~ span[data-feedback]'
  );
  expect(passwordConfirmFeedbacks).toHaveCount(0);

  const signUp = page.locator("'Sign Up'");
  await expect(signUp).toBeEnabled();

  page.on('dialog', async dialog => {
    expect(indent(dialog.message(), '    ')).toEqual(`\
    Valid form

    inputs =
    {
      "email": "john@beatles",
      "password": "Tr0ub4dor&3",
      "passwordConfirm": "Tr0ub4dor&3"
    }`);
    await dialog.accept();
  });
  await signUp.click();
});
