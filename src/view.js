/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import { setLocale } from 'yup';

export const validateUrl = (urlForm) => {
  setLocale({
    string: {
      url: 'urlError',
    },
    mixed: {
      notOneOf: 'urlExist',
    },
  });
  const schema = yup.object({
    url: yup.string().url().notOneOf(urlForm.loadedUrl),
  });
  return schema.validate(urlForm, { abortEarly: false });
};

export const handleErrors = (elements, i18, value) => {
  elements.errorPlace.textContent = i18.t(value);
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

export const showPosts = (elements, value, i18) => {
  const preparePosts = value.map((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const href = document.createElement('a');
    href.classList.add(`${post.uiReaded}`);
    href.setAttribute('data-id', `${post.id}`);
    href.setAttribute('href', `${post.link}`);
    href.setAttribute('rel', 'noopener noreferrer');
    href.setAttribute('target', '_blank');
    href.textContent = post.title;
    const btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('data-id', `${post.id}`);
    btn.setAttribute('data-bs-toggle', 'modal');
    btn.setAttribute('data-bs-target', '#modal');
    btn.textContent = i18.t('posts.readButton');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    li.append(href);
    li.append(btn);
    return li;
  });
  const mainDiv = document.createElement('div');
  mainDiv.classList.add('card', 'border-0');
  const innerDiv = document.createElement('div');
  innerDiv.classList.add('card-body');
  const h2Title = document.createElement('h2');
  h2Title.classList.add('card-title', 'h4');
  h2Title.textContent = i18.t('posts.formTitle');
  const ulForLi = document.createElement('ul');
  ulForLi.classList.add('list-group', 'border-0', 'rounded-0');
  mainDiv.append(innerDiv);
  ulForLi.append(...preparePosts);
  mainDiv.append(ulForLi);
  innerDiv.append(h2Title);
  elements.postsPlace.append(mainDiv);
};

const showFeeds = (elements, value, i18) => {
  const prepareFeed = value.map((feed) => (
    `<li class="list-group-item border-0 border-end-0">
    <h3 class="h6 m-0">${feed.title}</h3>
    <p class="m-0 small text-black-50">${feed.description}</p></li>`
  )).join('');
  const feedTemplate = `<div class="card border-0"><div class="card-body"><h2 class="card-title h4">${i18.t('feeds.feedTitle')}</h2></div><ul class="list-group border-0 rounded-0">${prepareFeed}</ul></div>`;
  elements.feedsPlace.innerHTML = feedTemplate;
};

const fillModal = (elements, post) => {
  const postOnDocument = document.querySelector(`[data-id="${post.id}"]`);
  postOnDocument.classList.replace('fw-bold', 'fw-normal');
  elements.modalTitle.textContent = post.title;
  elements.modalBody.textContent = post.description;
  elements.modalReadButton.setAttribute('href', post.link);
};

const disableUi = (elements, value) => {
  if (value) {
    elements.addFeedButton.setAttribute('disabled', true);
    elements.mainFormUrlInput.setAttribute('readonly', true);
  } else {
    elements.mainFormUrlInput.removeAttribute('readonly');
    elements.addFeedButton.removeAttribute('disabled');
  }
};

export const render = (elements, i18) => (path, value) => {
  switch (path) {
    case 'urlForm.errors':
      handleErrors(elements, i18, value);
      break;
    case 'feeds':
      showFeeds(elements, value, i18);
      cleanForm(elements, i18);
      break;
    case 'posts':
      showPosts(elements, value, i18);
      break;
    case 'urlForm.addButtonShow':
      disableUi(elements, value);
      break;
    case 'readedPosts':
      fillModal(elements, value);
      break;
    default:
      break;
  }
};
