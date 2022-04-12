export const normalizeArgs = (args: { [key: string]: any }): any => {
  const newArgs: {
    [key: string]: any;
  } = {};

  Object.keys(args).forEach((key) => {
    const normalizedKey = key.split('.');
    const isNested = normalizedKey.length === 2;

    if (isNested) {
      if (!newArgs[normalizedKey[0]]) {
        newArgs[normalizedKey[0]] = {};
      }
      newArgs[normalizedKey[0]][normalizedKey[1]] = args[key];
    } else {
      newArgs[key] = args[key];
    }
  });

  return newArgs;
};
