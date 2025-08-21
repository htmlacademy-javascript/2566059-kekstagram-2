import { createPhotos } from './data.js';

const template = document.querySelector('#picture').content.querySelector('.picture');
const container = document.querySelector('.pictures');

const photos = createPhotos();
const fragment = document.createDocumentFragment();

photos.forEach(({ url, description, likes, comments }) => {
  const photoItem = template.cloneNode(true);
  const img = photoItem.querySelector('.picture__img');
  img.src = url;
  img.alt = description;
  photoItem.querySelector('.picture__likes').textContent = String(likes);
  photoItem.querySelector('.picture__comments').textContent = String(comments.length);
  fragment.append(photoItem);
});

container.append(fragment);
