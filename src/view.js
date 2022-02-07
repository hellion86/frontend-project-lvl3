/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import { setLocale } from 'yup';

export const validateUrl = (urlForm, i18) => {
  setLocale({
    string: {
      url: i18.t('urlError'),
    },
    mixed: {
      notOneOf: i18.t('urlExist'),
    },
  });
  const schema = yup.object({
    url: yup.string().url().notOneOf(urlForm.loadedUrl),
  });
  return schema.validate(urlForm, { abortEarly: false });
};

export const handleErrors = (elements, value, i18) => {
  elements.errorPlace.textContent = value === 'Network Error' ? i18.t('netWorkError') : value;
  elements.errorPlace.classList.add('text-danger');
  elements.mainFormUrlInput.classList.add('is-invalid');
  elements.errorPlace.classList.remove('text-success');
};

const cleanForm = (elements, i18) => {
  elements.mainForm.reset();
  elements.mainFormUrlInput.focus();
  elements.errorPlace.innerHTML = i18.t('urlLoadSuccess');
  elements.errorPlace.classList.add('text-success');
  elements.errorPlace.classList.remove('text-danger');
  elements.mainFormUrlInput.classList.remove('is-invalid');
};

export const showPosts = (elements, value) => {
  const preparePosts = value.map((post) => (
    `<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
    <a href="${post.link}" class="${post.uiReaded}" data-id="${post.id}"  target="_blank" rel="noopener noreferrer">${post.title}</a>
    <button type="button" class="btn btn-outline-primary btn-sm" data-id="${post.id}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>
    </li>`
  )).join('');
  const postsTemplate = `<div class="card border-0"><div class="card-body"><h2 class="card-title h4">Посты</h2></div>
  <ul class="list-group border-0 rounded-0">${preparePosts}</ul></div>`;
  elements.postsPlace.innerHTML = postsTemplate;
};

const showFeeds = (elements, value) => {
  const prepareFeed = value.map((feed) => (
    `<li class="list-group-item border-0 border-end-0">
    <h3 class="h6 m-0">${feed.title}</h3>
    <p class="m-0 small text-black-50">${feed.description}</p></li>`
  )).join('');
  const feedTemplate = `<div class="card border-0"><div class="card-body"><h2 class="card-title h4">Фиды</h2></div><ul class="list-group border-0 rounded-0">${prepareFeed}</ul></div>`;
  elements.feedsPlace.innerHTML = feedTemplate;
};

const fillModal = (elements, post) => {
  const postOnDocument = document.querySelector(`[data-id="${post.id}"]`);
  postOnDocument.classList.replace('fw-bold', 'fw-normal');
  elements.modalTitle.textContent = post.title;
  elements.modalBody.textContent = post.description;
  elements.modalReadButton.setAttribute('href', post.link);
};

export const render = (elements, i18) => (path, value) => {
  switch (path) {
    case 'urlForm.errors':
      handleErrors(elements, value, i18);
      break;
    case 'feeds':
      showFeeds(elements, value);
      cleanForm(elements, i18);
      break;
    case 'posts':
      showPosts(elements, value);
      break;
    case 'urlForm.addButtonShow':
      if (value) {
        elements.addFeedButton.setAttribute('disabled', true);
        elements.mainFormUrlInput.setAttribute('readonly', true);
      } else {
        elements.mainFormUrlInput.removeAttribute('readonly');
        elements.addFeedButton.removeAttribute('disabled');
      }
      break;
    case 'readedPosts':
      fillModal(elements, value);
      break;
    default:
      break;
  }
};
