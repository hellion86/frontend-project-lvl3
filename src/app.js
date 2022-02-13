import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import onChange from 'on-change';
import i18n from 'i18next';
import {
  render, validateUrl,
} from './view.js';
import {
  loadUrl, updateRss, parserUrl, addListenerForModal,
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
    readedPosts: [],
    feeds: [],
    posts: [],
  }, render(elements, i18));

  elements.mainForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    state.urlForm.url = formData.get('url');
    state.urlForm.status = 'loadUrl';
    validateUrl(state.urlForm, i18)
      .then((data) => loadUrl(data.url))
      .then((rss) => parserUrl(rss, state.urlForm.url))
        // {
        // const [feed, posts] = parserUrl(rss, state.urlForm.url);
        // state.urlForm.loadedUrl.push(state.urlForm.url);
        // state.feeds.push(feed);
        // state.posts.push(...posts);
        // addListenerForModal(state);
        // state.urlForm.status = 'success';
      // })
      .then((parseRes) => {
        const [feed, posts] = parseRes;
        state.urlForm.loadedUrl.push(state.urlForm.url);
        state.feeds.push(feed);
        state.posts.push(...posts);
        addListenerForModal(state);
        state.urlForm.status = 'success';
      })
      .catch((error) => {
        state.urlForm.errors = error.message;
        state.urlForm.status = 'error';
      });
  });
  updateRss(state, i18);
};

const runApp = () => {
  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    resources: { ru },
  }).then(() => app(i18nextInstance));
};

export default runApp;
