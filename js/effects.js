const overlay = document.querySelector('.img-upload__overlay');
const preview = overlay.querySelector('.img-upload__preview img');

const scaleSmallerBtn = overlay.querySelector('.scale__control--smaller');
const scaleBiggerBtn = overlay.querySelector('.scale__control--bigger');
const scaleValueInput = overlay.querySelector('.scale__control--value');

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;

function parseScale(value) {
  return parseInt(String(value).replace('%', ''), 10);
}

function applyScale(valuePercent) {
  scaleValueInput.value = `${valuePercent}%`;
  const factor = valuePercent / 100;
  preview.style.transform = `scale(${factor})`;
}

function onScaleSmaller() {
  const current = parseScale(scaleValueInput.value);
  const next = Math.max(SCALE_MIN, current - SCALE_STEP);
  applyScale(next);
}

function onScaleBigger() {
  const current = parseScale(scaleValueInput.value);
  const next = Math.min(SCALE_MAX, current + SCALE_STEP);
  applyScale(next);
}

const effectLevelInput = overlay.querySelector('.effect-level__value');
const effectSlider = overlay.querySelector('.effect-level__slider');
const effectsForm = overlay.querySelector('.effects');

const Effect = {
  none: {
    filter: () => 'none',
    range: [0, 100],
    start: 100,
    step: 1,
    unit: ''
  },
  chrome: {
    filter: (v) => `grayscale(${v})`,
    range: [0, 1],
    start: 1,
    step: 0.1,
    unit: ''
  },
  sepia: {
    filter: (v) => `sepia(${v})`,
    range: [0, 1],
    start: 1,
    step: 0.1,
    unit: ''
  },
  marvin: {
    filter: (v) => `invert(${v}%)`,
    range: [0, 100],
    start: 100,
    step: 1,
    unit: '%'
  },
  phobos: {
    filter: (v) => `blur(${v}px)`,
    range: [0, 3],
    start: 3,
    step: 0.1,
    unit: 'px'
  },
  heat: {
    filter: (v) => `brightness(${v})`,
    range: [1, 3],
    start: 3,
    step: 0.1,
    unit: ''
  }
};

let currentEffectKey = 'none';

function ensureSlider() {
  if (!effectSlider.noUiSlider) {
    noUiSlider.create(effectSlider, {
      range: { min: 0, max: 100 },
      start: 100,
      step: 1,
      connect: 'lower'
    });
  }
}

function updateSliderForEffect(effectKey) {
  const cfg = Effect[effectKey];
  effectSlider.noUiSlider.updateOptions({
    range: { min: cfg.range[0], max: cfg.range[1] },
    start: cfg.start,
    step: cfg.step,
  });
}

function applyEffectFromSlider() {
  const cfg = Effect[currentEffectKey];
  const value = Number(effectSlider.noUiSlider.get());
  effectLevelInput.value = String(value);
  preview.style.filter = currentEffectKey === 'none' ? 'none' : cfg.filter(value);
}

function onEffectChange(evt) {
  const radio = evt.target.closest('.effects__radio');
  if (!radio) {
    return;
  }
  const effectKey = radio.value;
  currentEffectKey = effectKey;

  ensureSlider();
  updateSliderForEffect(effectKey);
  applyEffectFromSlider();

  const effectLevelField = overlay.querySelector('.effect-level');
  effectLevelField.classList.toggle('hidden', effectKey === 'none');
}

function initEditor() {
  applyScale(100);
  preview.style.filter = 'none';
  effectLevelInput.value = '';

  ensureSlider();
  effectSlider.noUiSlider.off('update');
  effectSlider.noUiSlider.on('update', applyEffectFromSlider);

  effectsForm.addEventListener('change', onEffectChange);

  scaleSmallerBtn.addEventListener('click', onScaleSmaller);
  scaleBiggerBtn.addEventListener('click', onScaleBigger);

  const noneRadio = effectsForm.querySelector('#effect-none');
  if (noneRadio) {
    noneRadio.checked = true;
    onEffectChange({ target: noneRadio });
  }
}


initEditor();

