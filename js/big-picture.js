const bigPicture = document.querySelector('.big-picture');
const closeBtn = bigPicture.querySelector('.big-picture__cancel');
const commentsContainer = bigPicture.querySelector('.social__comments');
const commentsCountBlock = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const shownCountEl = bigPicture.querySelector('.social__comment-shown-count');
const totalCountEl = bigPicture.querySelector('.social__comment-total-count');

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

function renderComments(comments) {
  commentsContainer.innerHTML = '';
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < comments.length; i++) {
    fragment.append(createCommentElement(comments[i]));
  }
  commentsContainer.append(fragment);

  shownCountEl.textContent = String(comments.length);
  totalCountEl.textContent = String(comments.length);
}

function fillBigPicture({ url, likes, description, comments }) {
  const img = bigPicture.querySelector('.big-picture__img img');
  img.src = url;
  img.alt = description;
  bigPicture.querySelector('.likes-count').textContent = String(likes);
  bigPicture.querySelector('.social__caption').textContent = description;
  renderComments(comments);
}

function onEscKeydown(evt) {
  if (isEsc(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
}

export function openBigPicture(photo) {
  fillBigPicture(photo);
  commentsCountBlock.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.addEventListener('keydown', onEscKeydown);
  closeBtn.addEventListener('click', closeBigPicture);
}

export function closeBigPicture() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onEscKeydown);
  closeBtn.removeEventListener('click', closeBigPicture);
}
