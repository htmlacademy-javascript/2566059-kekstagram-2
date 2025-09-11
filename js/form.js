import { sendForm } from './api.js';

const form = document.querySelector('.img-upload__form');
const fileInput = form.querySelector('#upload-file');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = overlay.querySelector('#upload-cancel');
const hashtagsInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const previewImg = overlay.querySelector('.img-upload__preview img');
const effectsPreviews = overlay.querySelectorAll('.effects__preview');

form.method = 'POST';
form.enctype = 'multipart/form-data';
form.action = 'https://28.javascript.pages.academy/kekstagram';

function openOverlay() {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

let currentObjectUrl = '';
const DEFAULT_PREVIEW_SRC = 'img/upload-default-image.jpg';
const ACCEPTED_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

function applyPreview(src) {
  previewImg.src = src;
  effectsPreviews.forEach((el) => {
    el.style.backgroundImage = `url(${src})`;
  });
}

function resetPreview() {
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = '';
  }
  applyPreview(DEFAULT_PREVIEW_SRC);
}

function resetFormValues() {
  form.reset();
  fileInput.value = '';
  resetPreview();
}

function closeOverlay() {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  resetFormValues();
}

function onEscKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeOverlay();
    document.removeEventListener('keydown', onEscKeydown);
  }
}

fileInput.addEventListener('change', () => {
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const ext = file.name.split('.').pop().toLowerCase();
    if (ACCEPTED_TYPES.includes(ext)) {
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
        currentObjectUrl = '';
      }
      currentObjectUrl = URL.createObjectURL(file);
      applyPreview(currentObjectUrl);
    } else {
      // Неподдерживаемый формат — сбрасываем превью к дефолтному
      resetPreview();
    }
    openOverlay();
    document.addEventListener('keydown', onEscKeydown);
  }
});

cancelButton.addEventListener('click', () => {
  closeOverlay();
});

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error-text'
});

const MAX_TAGS = 5;
const TAG_PATTERN = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;

function normalizeHashtags(value) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function validateTagsFormat(value) {
  const tags = normalizeHashtags(value);
  return tags.every((tag) => TAG_PATTERN.test(tag));
}

function validateTagsCount(value) {
  const tags = normalizeHashtags(value);
  return tags.length <= MAX_TAGS;
}

function validateTagsUnique(value) {
  const tags = normalizeHashtags(value).map((t) => t.toLowerCase());
  return new Set(tags).size === tags.length;
}

pristine.addValidator(hashtagsInput, validateTagsCount, 'Не более 5 хэштегов');
pristine.addValidator(hashtagsInput, validateTagsFormat, 'Хэштег должен начинаться с # и содержать 2–20 символов: буквы и цифры');
pristine.addValidator(hashtagsInput, validateTagsUnique, 'Хэштеги не должны повторяться');

const MAX_COMMENT = 140;
function validateCommentLength(value) {
  return value.length <= MAX_COMMENT;
}
pristine.addValidator(commentInput, validateCommentLength, 'Комментарий не длиннее 140 символов');

function showMessage(templateId) {
  const tpl = document.querySelector(templateId);
  if (!tpl) {
    return;
  }
  const el = tpl.content.firstElementChild.cloneNode(true);
  document.body.append(el);
  function onAnyClose() {
    el.remove();
    document.removeEventListener('keydown', onEsc);
    el.removeEventListener('click', onClick);
  }
  function onEsc(evt) {
    if (evt.key === 'Escape') {
      onAnyClose();
    }
  }
  function onClick(evt) {
    const blockSelector = templateId.replace('#', '.');
    if (evt.target.closest('button') || !evt.target.closest(blockSelector)) {
      onAnyClose();
    }
  }
  document.addEventListener('keydown', onEsc);
  el.addEventListener('click', onClick);
}

form.addEventListener('submit', async (evt) => {
  const isValid = pristine.validate();
  if (!isValid) {
    evt.preventDefault();
    return;
  }
  evt.preventDefault();
  const submitBtn = form.querySelector('.img-upload__submit');
  submitBtn.disabled = true;
  try {
    const formData = new FormData(form);
    await sendForm(formData);
    closeOverlay();
    showMessage('#success');
  } catch (e) {
    showMessage('#error');
  } finally {
    submitBtn.disabled = false;
  }
});

form.addEventListener('reset', () => {
  resetFormValues();
});
