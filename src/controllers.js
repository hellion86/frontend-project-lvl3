/* eslint-disable no-param-reassign */
import _ from 'lodash';
import { validateUrl } from './view.js';
import { loadUrl } from './utils.js';
import parserRss from './parser.js';

export const mainListener = (state, elements) => {
  elements.mainForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    state.urlForm.url = formData.get('url');
    state.urlForm.status = 'loadUrl';
    validateUrl(state.urlForm)
      .then((data) => loadUrl(data.url))
      .then((rss) => {
        const [feed, posts] = parserRss(rss);
        state.urlForm.loadedUrl.push(state.urlForm.url);
        const addIdtoPosts = posts.map((item) => ({ ...item, id: _.uniqueId() }));
        state.feeds.push(feed);
        state.posts.push(...addIdtoPosts);
        state.urlForm.status = 'success';
      })
      .catch((error) => {
        state.urlForm.status = 'error';
        state.urlForm.errors = error.message;
      });
  });
};

export const modalListener = (state, elements) => {
  elements.postsPlace.addEventListener('click', (item) => {
    const [postsState] = state.posts;
    const postId = item.target.getAttribute('data-id');
    const postDataFromState = _.find(state.posts, ['id', postId]);
    if (!postsState.uiState.includes(postId)) {
      postsState.uiState.push(postId);
    }
    if (postId) {
      state.modalForm.postData = {
        id: postId,
        title: postDataFromState.title,
        body: postDataFromState.description,
        url: postDataFromState.link,
      };
    }
  });
};
