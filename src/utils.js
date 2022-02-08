/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import { uniqueId, concat, find } from 'lodash';
import * as axios from 'axios';

export const parserUrl = (url, i18) => {
  const parser = new DOMParser();
  const dataFromUrl = parser.parseFromString(url.data.contents, 'text/xml');
  if (dataFromUrl.querySelector('parsererror')) {
    throw new Error(`${i18.t('badRss')}`);
  } else {
    return dataFromUrl;
  }
};

export const loadUrl = (link) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(link)}`);

export const makePosts = (data, idFeed) => {
  const items = data.querySelectorAll('item');
  const posts = Array.from(items).map((item) => (
    {
      id: uniqueId(),
      idFeed,
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
      uiReaded: 'fw-bold',
    }
  ));
  return posts;
};

export const makeFeeds = (data, url, num) => {
  const date = data.querySelector('pubDate') ? data.querySelector('pubDate').textContent : new Date();
  const feed = {
    id: num + 1,
    url,
    date,
    title: data.querySelector('title').textContent,
    description: data.querySelector('description').textContent,
  };
  return feed;
};

export const addListenerForModal = (state) => {
  const postsButtons = document.querySelectorAll('.btn-outline-primary');
  const allHrefsOnPage = document.querySelectorAll('.fw-bold');
  const handler = (item) => {
    const postId = item.target.getAttribute('data-id');
    const getPost = find(state.posts, ['id', postId]);
    getPost.uiReaded = 'fw-normal';
    state.readedPosts = getPost;
  };

  allHrefsOnPage.forEach((href) => {
    href.addEventListener('click', (link) => handler(link));
  });

  postsButtons.forEach((button) => {
    button.addEventListener('click', (btn) => handler(btn));
  });
};

export const updateRss = (state, i18) => {
  if (state.urlForm.loadedUrl.length !== 0) {
    state.feeds.forEach((feed) => {
      loadUrl(feed.url)
        .then((rss) => {
          const dataFeed = parserUrl(rss, i18);
          if (dataFeed.querySelector('pubDate').textContent !== feed.date) {
            const newPosts = makePosts(dataFeed, feed.id);
            feed.date = dataFeed.querySelector('pubDate').textContent;
            const otherPosts = state.posts.filter((postOth) => postOth.idFeed !== feed.id);
            state.posts = concat(newPosts, otherPosts).sort((a, b) => a.idFeed - b.idFeed);
          }
        })
        .then(() => addListenerForModal(state))
        .catch((error) => { state.urlForm.errors = error.message; });
    });
  }
  setTimeout(() => updateRss(state, i18), 5000);
};
