const form = document.querySelector('.img-upload__form');
const fileInput = form.querySelector('#upload-file');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = overlay.querySelector('#upload-cancel');
const hashtagsInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');

function openOverlay() {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function resetFormValues() {
  form.reset();
  fileInput.value = '';
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

form.addEventListener('submit', (evt) => {
  const isValid = pristine.validate();
  if (!isValid) {
    evt.preventDefault();
  }
});
