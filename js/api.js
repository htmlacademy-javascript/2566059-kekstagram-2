const API_BASE = 'https://28.javascript.pages.academy/kekstagram';
const API_GET = `${API_BASE}/data`;

export async function getPhotos() {
  const response = await fetch(API_GET);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки: ${response.status}`);
  }
  return response.json();
}

export async function sendForm(formData) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) {
    throw new Error(`Ошибка отправки: ${response.status}`);
  }
  return response.json();
}
