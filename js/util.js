export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomArrayElement(array) {
  return array[getRandomInt(0, array.length - 1)];
}
