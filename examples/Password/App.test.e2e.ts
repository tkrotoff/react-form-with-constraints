// @ts-ignore
jest.setTimeout(20000); // 20s

function indent(text: string, indentation: string) {
  // [Add a char to the start of each line in JavaScript using regular expression](https://stackoverflow.com/q/11939575)
  // [Trim trailing spaces before newlines in a single multi-line string in JavaScript](https://stackoverflow.com/q/5568797)
  return text.replace(/^/gm, indentation).replace(/[^\S\r\n]+$/gm, '');
}

beforeEach(async () => {
  await page.goto('http://localhost:8080');
});

test('john@beatles/123456/12345', async () => {
  const email = (await page.$('input[name=email]'))!;
  await email.click();
  await email.type('john@beatles');
  await page.waitForSelector('input[name=email] ~ span[data-feedback]');
  //const emailFeedbacks = await page.$$('input[name=email] ~ span[data-feedback]');
  const emailFeedbacks = await email.$x('./following-sibling::span[@data-feedback]');
  expect(emailFeedbacks).toHaveLength(1);
  await expect(emailFeedbacks[0]).toMatch('Looks good!');

  const password = (await page.$('input[name=password]'))!;
  await password.click();
  await password.type('123456');
  await page.waitForSelector('input[name=password] ~ span[data-feedback].when-valid');
  const passwordFeedbacks = await page.$$('input[name=password] ~ span[data-feedback]');
  expect(passwordFeedbacks).toHaveLength(5);
  await expect(passwordFeedbacks[0]).toMatch('Should contain small letters');
  await expect(passwordFeedbacks[1]).toMatch('Should contain capital letters');
  await expect(passwordFeedbacks[2]).toMatch('Should contain special characters');
  await expect(passwordFeedbacks[3]).toMatch('This password is very common');
  await expect(passwordFeedbacks[4]).toMatch('Looks good!');

  const passwordConfirm = (await page.$('input[name=passwordConfirm]'))!;
  await passwordConfirm.click();
  await passwordConfirm.type('12345');
  const passwordConfirmFeedbacks = await page.$$(
    'input[name=passwordConfirm] ~ span[data-feedback]'
  );
  expect(passwordConfirmFeedbacks).toHaveLength(1);
  await expect(passwordConfirmFeedbacks[0]).toMatch('Not the same password');

  const signUp = (await page.$x("//button[text() = 'Sign Up']"))[0];
  // [Get Custom Attribute value](https://github.com/GoogleChrome/puppeteer/issues/1451)
  const disabled = await page.evaluate(el => el.getAttribute('disabled'), signUp);
  expect(disabled).toEqual('');
});

test('john@beatles/Tr0ub4dor&3/Tr0ub4dor&3', async () => {
  const email = (await page.$('input[name=email]'))!;
  await email.click();
  await email.type('john@beatles');
  await page.waitForSelector('input[name=email] ~ span[data-feedback]');
  //const emailFeedbacks = await page.$$('input[name=email] ~ span[data-feedback]');
  const emailFeedbacks = await email.$x('./following-sibling::span[@data-feedback]');
  expect(emailFeedbacks).toHaveLength(1);
  await expect(emailFeedbacks[0]).toMatch('Looks good!');

  const password = (await page.$('input[name=password]'))!;
  await password.click();
  await password.type('Tr0ub4dor&3');
  await page.waitForSelector('input[name=password] ~ span[data-feedback].when-valid');
  const passwordFeedbacks = await page.$$('input[name=password] ~ span[data-feedback]');
  expect(passwordFeedbacks).toHaveLength(1);
  await expect(passwordFeedbacks[0]).toMatch('Looks good!');

  const passwordConfirm = (await page.$('input[name=passwordConfirm]'))!;
  await passwordConfirm.click();
  await passwordConfirm.type('Tr0ub4dor&3');
  const passwordConfirmFeedbacks = await page.$$(
    'input[name=passwordConfirm] ~ span[data-feedback]'
  );
  expect(passwordConfirmFeedbacks).toHaveLength(0);

  const signUp = (await page.$x("//button[text() = 'Sign Up']"))[0];
  // [Get Custom Attribute value](https://github.com/GoogleChrome/puppeteer/issues/1451)
  const disabled = await page.evaluate(el => el.getAttribute('disabled'), signUp);
  expect(disabled).toEqual(null);

  const dialog = await expect(page).toDisplayDialog(async () => {
    await signUp.click();
  });
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
