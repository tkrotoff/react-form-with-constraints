import { wait } from './wait';

export async function checkUsernameAvailability(value: string) {
  await wait(10);
  if (value === 'error') {
    throw new Error(`Something wrong with username '${value}'`);
  } else {
    return {
      value,
      available: !['john', 'paul', 'george', 'ringo'].includes(value.toLowerCase())
    };
  }
}
