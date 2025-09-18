export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomArrayElement(array) {
  return array[getRandomInt(0, array.length - 1)];
}

export function debounce(callback, timeout = 500) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, args), timeout);
  };
}
