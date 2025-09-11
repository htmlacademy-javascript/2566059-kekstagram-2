import { openBigPicture } from './big-picture.js';
import { getPhotos } from './api.js';
import { debounce, getRandomInt } from './util.js';

const template = document.querySelector('#picture').content.querySelector('.picture');
const container = document.querySelector('.pictures');
const filters = document.querySelector('.img-filters');
const filterForm = document.querySelector('.img-filters__form');

let originalPhotos = [];

function clearThumbnails() {
  container.querySelectorAll('.picture').forEach((el) => el.remove());
}

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

function getRandomUnique(items, count) {
  const copy = items.slice();
  const result = [];
  while (copy.length > 0 && result.length < count) {
    const index = getRandomInt(0, copy.length - 1);
    result.push(copy.splice(index, 1)[0]);
  }
  return result;
}

function sortByCommentsDesc(items) {
  return items.slice().sort((a, b) => b.comments.length - a.comments.length);
}

function setActive(buttonId) {
  filterForm.querySelectorAll('.img-filters__button').forEach((buttonEl) => buttonEl.classList.remove('img-filters__button--active'));
  const targetBtn = filterForm.querySelector(`#${buttonId}`);
  if (targetBtn) {
    targetBtn.classList.add('img-filters__button--active');
  }
}

const applyFilterDebounced = debounce((filterId) => {
  clearThumbnails();
  if (filterId === 'filter-default') {
    render(originalPhotos);
  } else if (filterId === 'filter-random') {
    render(getRandomUnique(originalPhotos, 10));
  } else if (filterId === 'filter-discussed') {
    render(sortByCommentsDesc(originalPhotos));
  } else {
    render(originalPhotos);
  }
}, 500);

filterForm.addEventListener('click', (evt) => {
  const button = evt.target.closest('.img-filters__button');
  if (!button) {
    return;
  }
  setActive(button.id);
  applyFilterDebounced(button.id);
});

(async () => {
  try {
    originalPhotos = await getPhotos();
    render(originalPhotos);
    filters.classList.remove('img-filters--inactive');
  } catch (e) {
    showDataError('Не удалось загрузить данные');
  }
})();
