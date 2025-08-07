const descriptions = [
  'Закат на море',
  'Горы в облаках',
  'Уютное кафе',
  'Друзья на пикнике',
  'Город ночью',
  'Пляж и пальмы',
];

const messages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const names = [
  'Артём', 'Мария', 'Иван', 'Ольга', 'Дмитрий', 'Екатерина'
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayElement(array) {
  return array[getRandomInt(0, array.length - 1)];
}

const usedCommentIds = new Set();
function generateUniqueCommentId() {
  let id;
  do {
    id = getRandomInt(100, 10000);
  } while (usedCommentIds.has(id));
  usedCommentIds.add(id);
  return id;
}

function generateComment() {

  let message = getRandomArrayElement(messages);
  if (Math.random() > 0.5) {
    let secondMessage;
    do {
      secondMessage = getRandomArrayElement(messages);
    } while (secondMessage === message);
    message = `${message} ${secondMessage}`;
  }
  return {
    id: generateUniqueCommentId(),
    avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
    message: message,
    name: getRandomArrayElement(names)
  };
}

function generateComments() {
  const commentsCount = getRandomInt(0, 30);
  const comments = [];
  for (let i = 0; i < commentsCount; i++) {
    comments.push(generateComment());
  }
  return comments;
}

function generatePhotos() {
  const photos = [];
  for (let i = 1; i <= 25; i++) {
    photos.push({
      id: i,
      url: `photos/${i}.jpg`,
      description: descriptions[i - 1],
      likes: getRandomInt(15, 200),
      comments: generateComments()
    });
  }
  return photos;
}

generatePhotos();
