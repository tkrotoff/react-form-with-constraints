function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function checkUsernameAvailability(value: string) {
  await sleep(10);
  if (value === 'error') {
    throw new Error(`Something wrong with username '${value}'`);
  } else {
    return {
      value,
      available: !['john', 'paul', 'george', 'ringo'].includes(value.toLowerCase())
    };
  }
}
