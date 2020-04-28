export const cacheFn = (fn, decaySeconds = 10) => {
  const noReturnValue = Symbol('cacheFn~' + fn.name);
  let cachedReturnValue = noReturnValue;
  let timer;

  return (...args) => {
    if (cachedReturnValue === noReturnValue) {
      cachedReturnValue = fn(...args);
      timer = setTimeout(() => {
        cachedReturnValue = noReturnValue;
      }, decaySeconds * 1000);
    }

    return cachedReturnValue;
  };
};
