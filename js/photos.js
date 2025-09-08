import { openBigPicture } from './big-picture.js';
import { getPhotos } from './api.js';

const template = document.querySelector('#picture').content.querySelector('.picture');
const container = document.querySelector('.pictures');

function render(photos) {
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
}

function showDataError(message) {
  const tpl = document.querySelector('#data-error');
  if (!tpl) {
    return;
  }
  const el = tpl.content.firstElementChild.cloneNode(true);
  el.querySelector('.data-error__title').textContent = message;
  document.body.append(el);
  setTimeout(() => el.remove(), 3000);
}

(async () => {
  try {
    const photos = await getPhotos();
    render(photos);
  } catch (e) {
    showDataError('Не удалось загрузить данные');
  }
})();
