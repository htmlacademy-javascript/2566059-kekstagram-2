import { createPhotos } from './data.js';
import { openBigPicture } from './big-picture.js';

const template = document.querySelector('#picture').content.querySelector('.picture');
const container = document.querySelector('.pictures');

const photos = createPhotos();
const fragment = document.createDocumentFragment();

photos.forEach((photo) => {
  const photoItem = template.cloneNode(true);
  const img = photoItem.querySelector('.picture__img');
  img.src = photo.url;
  img.alt = photo.description;
  photoItem.querySelector('.picture__likes').textContent = String(photo.likes);
  photoItem.querySelector('.picture__comments').textContent = String(photo.comments.length);

  photoItem.addEventListener('click', () => openBigPicture(photo));

  fragment.append(photoItem);
});

container.append(fragment);
