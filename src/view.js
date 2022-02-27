/* eslint-disable no-param-reassign */
import * as yup from 'yup';

export const validateUrl = (urlForm) => {
  yup.setLocale({
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

export const handleErrors = (elements, value, i18) => {
  elements.errorPlace.textContent = i18.t(`${value}`);
  elements.errorPlace.classList.add('text-danger');
  elements.mainFormUrlInput.classList.add('is-invalid');
  elements.errorPlace.classList.remove('text-success');
};

const cleanForm = (elements, i18) => {
  elements.mainFormUrlInput.value = '';
  elements.mainFormUrlInput.focus();
  elements.errorPlace.textContent = i18.t('urlLoadSuccess');
  elements.errorPlace.classList.add('text-success');
  elements.errorPlace.classList.remove('text-danger');
  elements.mainFormUrlInput.classList.remove('is-invalid');
  elements.mainFormUrlInput.removeAttribute('readonly');
  elements.addFeedButton.removeAttribute('disabled');
};

const handleModal = (elements, value) => {
  const postOnPage = elements.postsPlace.querySelector(`[data-id="${value.id}"]`);
  postOnPage.classList.replace('fw-bold', 'fw-normal');
  elements.modalTitle.textContent = value.title;
  elements.modalBody.textContent = value.body;
  elements.modalReadButton.setAttribute('href', value.url);
};

export const showPosts = (elements, value, i18) => {
  const [postsState, ...posts] = value;
  const preparePosts = posts.map((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const href = document.createElement('a');
    const typeOfTextPost = postsState.uiState.includes(post.id) ? 'fw-normal' : 'fw-bold';
    href.classList.add(typeOfTextPost);
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
  const headTitle = document.createElement('h2');
  headTitle.classList.add('card-title', 'h4');
  headTitle.textContent = i18.t('posts.formTitle');
  const ulPostPlace = document.createElement('ul');
  ulPostPlace.classList.add('list-group', 'border-0', 'rounded-0');
  mainDiv.append(innerDiv);
  ulPostPlace.append(...preparePosts);
  mainDiv.append(ulPostPlace);
  innerDiv.append(headTitle);
  const isPostOnPage = elements.postsPlace.querySelector('.border-0');
  if (isPostOnPage) {
    isPostOnPage.replaceWith(mainDiv);
  }
  elements.postsPlace.append(mainDiv);
};

const showFeeds = (elements, value, i18) => {
  const prepareFeed = value.map((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3El = document.createElement('h3');
    h3El.classList.add('h6', 'm-0');
    h3El.textContent = feed.title;
    const pEl = document.createElement('p');
    pEl.classList.add('m-0', 'small', 'text-black-50');
    pEl.textContent = feed.description;
    li.append(h3El);
    li.append(pEl);
    return li;
  });
  const mainDiv = document.createElement('div');
  mainDiv.classList.add('card', 'border-0');
  const innerDiv = document.createElement('div');
  innerDiv.classList.add('card-body');
  const h2El = document.createElement('h2');
  h2El.classList.add('card-title', 'h4');
  h2El.textContent = i18.t('feeds.feedTitle');
  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');
  innerDiv.append(h2El);
  ulEl.append(...prepareFeed);
  innerDiv.append(ulEl);
  mainDiv.append(innerDiv);
  const isFeedOnPage = elements.feedsPlace.querySelector('.border-0');
  if (isFeedOnPage) {
    isFeedOnPage.replaceWith(mainDiv);
  }
  elements.feedsPlace.append(mainDiv);
};

const handleProcessState = (elements, processState, i18) => {
  switch (processState) {
    case 'loadUrl':
      elements.addFeedButton.setAttribute('disabled', true);
      elements.mainFormUrlInput.setAttribute('readonly', true);
      break;
    case 'success':
      cleanForm(elements, i18);
      break;
    case 'error':
      elements.mainFormUrlInput.removeAttribute('readonly');
      elements.addFeedButton.removeAttribute('disabled');
      break;
    default:
      break;
  }
};

export const render = (elements, i18) => (path, value) => {
  switch (path) {
    case 'urlForm.errors':
      handleErrors(elements, value, i18);
      break;
    case 'feeds':
      showFeeds(elements, value, i18);
      break;
    case 'posts':
      showPosts(elements, value, i18);
      break;
    case 'urlForm.status':
      handleProcessState(elements, value, i18);
      break;
    case 'modalForm.postData':
      handleModal(elements, value);
      break;
    default:
      break;
  }
};
