jest.setTimeout(20000); // 20s

const indent = (text: string, indentation: string) => {
  // See Add a char to the start of each line in JavaScript using regular expression https://stackoverflow.com/q/11939575
  // See Trim trailing spaces before newlines in a single multi-line string in JavaScript https://stackoverflow.com/q/5568797
  return text.replace(/^/gm, indentation).replace(/[^\S\r\n]+$/gm, '');
};

beforeEach(async () => {
  await page.goto('http://localhost:8080');
});

test('john@beatles/123456/12345', async () => {
  const username = (await page.$('input[name=username]'))!;
  await username.click();
  await username.type('john@beatles');
  await page.waitFor('input[name=username] ~ span[data-feedback]');
  //const usernameFeedbacks = await page.$$('input[name=username] ~ span[data-feedback]');
  const usernameFeedbacks = await username.$x('./following-sibling::span[@data-feedback]');
  expect(usernameFeedbacks).toHaveLength(1);
  await expect(usernameFeedbacks[0]).toMatch('Looks good!');

  const password = (await page.$('input[name=password]'))!;
  await password.click();
  await password.type('123456');
  await page.waitFor('input[name=password] ~ span[data-feedback].when-valid');
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
  const passwordConfirmFeedbacks = await page.$$('input[name=passwordConfirm] ~ span[data-feedback]');
  expect(passwordConfirmFeedbacks).toHaveLength(1);
  await expect(passwordConfirmFeedbacks[0]).toMatch('Not the same password');

  const signUp = (await page.$x("//button[text() = 'Sign Up']"))[0];
  // See Get Custom Attribute value https://github.com/GoogleChrome/puppeteer/issues/1451
  const disabled = await page.evaluate(el => el.getAttribute('disabled'), signUp);
  expect(disabled).toEqual('');
});

test('john@beatles/Tr0ub4dor&3/Tr0ub4dor&3', async () => {
  const username = (await page.$('input[name=username]'))!;
  await username.click();
  await username.type('john@beatles');
  await page.waitFor('input[name=username] ~ span[data-feedback]');
  //const usernameFeedbacks = await page.$$('input[name=username] ~ span[data-feedback]');
  const usernameFeedbacks = await username.$x('./following-sibling::span[@data-feedback]');
  expect(usernameFeedbacks).toHaveLength(1);
  await expect(usernameFeedbacks[0]).toMatch('Looks good!');

  const password = (await page.$('input[name=password]'))!;
  await password.click();
  await password.type('Tr0ub4dor&3');
  await page.waitFor('input[name=password] ~ span[data-feedback].when-valid');
  const passwordFeedbacks = await page.$$('input[name=password] ~ span[data-feedback]');
  expect(passwordFeedbacks).toHaveLength(1);
  await expect(passwordFeedbacks[0]).toMatch('Looks good!');

  const passwordConfirm = (await page.$('input[name=passwordConfirm]'))!;
  await passwordConfirm.click();
  await passwordConfirm.type('Tr0ub4dor&3');
  const passwordConfirmFeedbacks = await page.$$('input[name=passwordConfirm] ~ span[data-feedback]');
  expect(passwordConfirmFeedbacks).toHaveLength(0);

  const signUp = (await page.$x("//button[text() = 'Sign Up']"))[0];
  // See Get Custom Attribute value https://github.com/GoogleChrome/puppeteer/issues/1451
  const disabled = await page.evaluate(el => el.getAttribute('disabled'), signUp);
  expect(disabled).toEqual(null);

  const dialog = await expect(page).toDisplayDialog(async () => {
    await signUp.click();
  });
  expect(indent(dialog.message(), '    ')).toEqual(`\
    Valid form

    this.state =
    {
      "username": "john@beatles",
      "password": "Tr0ub4dor&3",
      "passwordConfirm": "Tr0ub4dor&3",
      "signUpButtonDisabled": false
    }`
  );
  await dialog.accept();
});
