/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import _ from 'lodash';
import axios from 'axios';

export const parserRss = (data) => {
  const parser = new DOMParser();
  const dataFromUrl = parser.parseFromString(data.data.contents, 'text/xml');
  if (dataFromUrl.querySelector('parsererror')) {
    throw new Error('badRss');
  } else {
    const feed = {
      title: dataFromUrl.querySelector('title').textContent,
      description: dataFromUrl.querySelector('description').textContent,
      url: data.data.status.url,
    };
    const dataFromFlow = dataFromUrl.querySelectorAll('item');
    const posts = Array.from(dataFromFlow).map((item) => (
      {
        title: item.querySelector('title').textContent,
        guid: item.querySelector('guid').textContent,
        description: item.querySelector('description').textContent,
        link: item.querySelector('link').textContent,
        pubDate: item.querySelector('pubDate').textContent,
      }
    ));
    return [feed, posts];
  }
};

export const loadUrl = (link) => {
  const mainUrl = new URL('/get?', 'https://hexlet-allorigins.herokuapp.com');
  mainUrl.searchParams.append('disableCache', true);
  mainUrl.searchParams.append('charset', 'utf-8');
  mainUrl.searchParams.append('url', link);
  return new Promise((resolve, reject) => {
    const flow = axios.get(mainUrl);
    flow.then((data) => resolve(data)).catch((err) => reject(err));
  });
};

export const addListenerForModal = (state, elements) => {
  const postsContainer = document.querySelector('.posts');
  postsContainer.addEventListener('click', (item) => {
    const [postsState] = state.posts;
    const postId = item.target.getAttribute('data-id');
    const postOnPage = postsContainer.querySelector(`[data-id="${postId}"]`);
    const postDataFromState = _.find(state.posts, ['id', postId]);
    const postUiState = _.find(postsState.uiState, ['id', postId]);
    postUiState.typeOfName = 'fw-normal';
    if (postId) {
      postOnPage.classList.replace('fw-bold', 'fw-normal');
      elements.modalTitle.textContent = postDataFromState.title;
      elements.modalBody.textContent = postDataFromState.description;
      elements.modalReadButton.setAttribute('href', postDataFromState.link);
    }
  });
};

export const updateRss = (state) => {
  const loadAll = Promise.all(state.urlForm.loadedUrl.map((link) => loadUrl(link)));
    loadAll.then((data) => {
      const parsedData = data.map((flow) => parserRss(flow));
      const takePosts = parsedData.map((item) => item[1]);
      const diff = _.differenceBy(_.concat(...takePosts), state.posts, 'title');
      if (diff.length > 0) {
        const addIdtodiff = diff.map((item) => ({ ...item, id: _.uniqueId() }));
        const [postsState] = state.posts;
        addIdtodiff.forEach((post) => {
          postsState.uiState.push({ id: post.id, typeOfName: 'fw-bold' });
        });
        state.posts.push(...addIdtodiff);
      }
    })
    .then(() => setTimeout(() => updateRss(state), 5000))
    .catch((error) => {
      state.urlForm.status = 'error';
      state.urlForm.errors = error.message;
    });
};
