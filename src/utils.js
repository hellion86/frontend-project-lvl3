/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import _ from 'lodash';
import axios from 'axios';

export const parserRss = (loadData) => {
  const parser = new DOMParser();
  const dataFromUrl = parser.parseFromString(loadData.data.contents, 'text/xml');
  if (dataFromUrl.querySelector('parsererror')) {
    // const errorCode = loadData.data.status.http_code ? loadData.data.status.http_code : 404;
    throw new Error(`badRss.${404}`);
  } else {
    const feed = {
      title: dataFromUrl.querySelector('title').textContent,
      description: dataFromUrl.querySelector('description').textContent,
    };
    const dataFromFlow = dataFromUrl.querySelectorAll('item');
    const posts = Array.from(dataFromFlow).map((item) => (
      {
        title: item.querySelector('title').textContent,
        description: item.querySelector('description').textContent,
        link: item.querySelector('link').textContent,
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
  return axios.get(mainUrl.toString());
};

export const addListenerForModal = (state, elements) => {
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

export const updateRss = (state) => {
 Promise.all(state.urlForm.loadedUrl.map((link) => {
   const handleEachFeed = loadUrl(link)
      .then((data) => {
        const [, posts] = parserRss(data);
        const diff = _.differenceBy(posts, state.posts, 'title');
        const addIdtodiff = diff.map((item) => ({ ...item, id: _.uniqueId() }));
        state.posts.push(...addIdtodiff);
      });
      return handleEachFeed;
  }));
  setTimeout(() => updateRss(state), 5000);
};
