import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import onChange from 'on-change';
import i18n from 'i18next';
import { uniqueId } from 'lodash';
import {
  render, validateUrl,
} from './view.js';
import {
  loadUrl, updateRss, parserRss, addListenerForModal,
} from './utils.js';
import ru from './locales/ru.js';

const app = (i18) => {
  const elements = {
    mainForm: document.querySelector('form'),
    errorPlace: document.querySelector('.feedback'),
    mainFormUrlInput: document.querySelector('#url-input'),
    addFeedButton: document.querySelector('[aria-label="add"]'),
    postsPlace: document.querySelector('.posts'),
    feedsPlace: document.querySelector('.feeds'),
    modalForm: document.querySelector('#modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalReadButton: document.querySelector('[role="button"]'),
    modalCloseButton: document.querySelectorAll('[data-bs-dismiss="modal"]'),
    body: document.querySelector('body'),
  };

  const state = onChange({
    urlForm: {
      status: '',
      loadedUrl: [],
      url: '',
      errors: '',
    },
    feeds: [],
    posts: [{ uiState: [] }],
  }, render(elements, i18));

  addListenerForModal(state, elements);

  elements.mainForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    state.urlForm.url = formData.get('url');
    state.urlForm.status = 'loadUrl';
    validateUrl(state.urlForm)
      .then((data) => loadUrl(data.url))
      .then((rss) => {
        const [feed, posts] = parserRss(rss, state.urlForm.url);
        const [postsState] = state.posts;
        state.urlForm.loadedUrl.push(state.urlForm.url);
        const addIdtoPosts = posts.map((item) => ({ ...item, id: uniqueId() }));
        addIdtoPosts.forEach((post) => {
          postsState.uiState.push({ id: post.id, typeOfName: 'fw-bold' });
        });
        state.feeds.push(feed);
        state.posts.push(...addIdtoPosts);
        state.urlForm.status = 'success';
      })
      .catch((error) => {
        state.urlForm.status = 'error';
        state.urlForm.errors = error.message;
      });
  });
  // updateRss(state, i18);
};

const runApp = () => {
  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    resources: { ru },
  }).then(() => app(i18nextInstance));
};

export default runApp;
