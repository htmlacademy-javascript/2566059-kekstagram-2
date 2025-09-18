const bigPicture = document.querySelector('.big-picture');
const closeBtn = bigPicture.querySelector('.big-picture__cancel');
const commentsContainer = bigPicture.querySelector('.social__comments');
const commentsCountBlock = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const shownCountEl = bigPicture.querySelector('.social__comment-shown-count');
const totalCountEl = bigPicture.querySelector('.social__comment-total-count');

const COMMENTS_PER_PAGE = 5;
let currentComments = [];
let shownCount = 0;

function isEsc(evt) {
  return evt.key === 'Escape';
}

function createCommentElement({ avatar, name, message }) {
  const li = document.createElement('li');
  li.className = 'social__comment';

  const img = document.createElement('img');
  img.className = 'social__picture';
  img.src = avatar;
  img.alt = name;
  img.width = 35;
  img.height = 35;

  const text = document.createElement('p');
  text.className = 'social__text';
  text.textContent = message;

  li.append(img, text);
  return li;
}

function updateCounters() {
  shownCountEl.textContent = String(shownCount);
  totalCountEl.textContent = String(currentComments.length);
}

function renderNextBatch() {
  const start = shownCount;
  const end = Math.min(shownCount + COMMENTS_PER_PAGE, currentComments.length);
  const fragment = document.createDocumentFragment();

  for (let i = start; i < end; i++) {
    fragment.append(createCommentElement(currentComments[i]));
  }

  commentsContainer.append(fragment);
  shownCount = end;
  updateCounters();

  if (shownCount >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  }
}

function fillBigPicture({ url, likes, description, comments }) {
  const img = bigPicture.querySelector('.big-picture__img img');
  img.src = url;
  img.alt = description;
  bigPicture.querySelector('.likes-count').textContent = String(likes);
  bigPicture.querySelector('.social__caption').textContent = description;


  commentsContainer.innerHTML = '';
  currentComments = comments || [];
  shownCount = 0;
  commentsCountBlock.classList.remove('hidden');
  commentsLoader.classList.toggle('hidden', currentComments.length === 0);
  updateCounters();
  if (currentComments.length > 0) {
    renderNextBatch();
  }
}

function onEscKeydown(evt) {
  if (isEsc(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
}

function onLoadMoreClick() {
  renderNextBatch();
}

export function openBigPicture(photo) {
  fillBigPicture(photo);

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.addEventListener('keydown', onEscKeydown);
  closeBtn.addEventListener('click', closeBigPicture);
  commentsLoader.addEventListener('click', onLoadMoreClick);
}

export function closeBigPicture() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onEscKeydown);
  closeBtn.removeEventListener('click', closeBigPicture);
  commentsLoader.removeEventListener('click', onLoadMoreClick);
}
