import sleep from './sleep';

const checkUsernameAvailability = async (value: string) => {
  await sleep(10);
  if (value === 'error') {
    throw new Error(`Something wrong with username '${value}'`);
  } else {
    return {
      value,
      available: !['john', 'paul', 'george', 'ringo'].includes(value.toLowerCase())
    };
  }
};

export default checkUsernameAvailability;
