/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import { uniqueId, find, differenceBy } from 'lodash';
import * as axios from 'axios';

export const parserRss = (data, url, setFeedIdmanual = false) => {
  const parser = new DOMParser();
  const dataFromUrl = parser.parseFromString(data.data.contents, 'text/xml');
  if (dataFromUrl.querySelector('parsererror')) {
    throw new Error('badRss');
  } else {
    const feedDate = dataFromUrl.querySelector('pubDate') ? dataFromUrl.querySelector('pubDate').textContent : new Date();
    const feed = {
      date: feedDate,
      id: uniqueId(),
      url,
      title: dataFromUrl.querySelector('title').textContent,
      description: dataFromUrl.querySelector('description').textContent,
    };
    const items = dataFromUrl.querySelectorAll('item');
    const idForPosts = setFeedIdmanual ? `${setFeedIdmanual}` : feed.id;
    const posts = Array.from(items).map((item) => (
      {
        // id: uniqueId(),
        idFeed: idForPosts,
        title: item.querySelector('title').textContent,
        description: item.querySelector('description').textContent,
        link: item.querySelector('link').textContent,
        uiReaded: 'fw-bold',
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

export const addListenerForModal = (state) => {
  const postsContainer = document.querySelector('.posts');
  postsContainer.addEventListener('click', (item) => {
    // console.log(item);
    const postId = item.target.getAttribute('data-id');
    // console.log(postId);
    if (postId) {
      const currentPost = find(state.posts, ['id', postId]);
      console.log(currentPost);
      currentPost.uiReaded = 'fw-normal';
      state.readedPost = currentPost;
    }
  });
};

export const updateRss = (state, i18) => {
  if (state.urlForm.loadedUrl.length !== 0) {
    state.feeds.forEach((feed) => {
      loadUrl(feed.url)
        .then((rss) => {
          const [loadFeed, posts] = parserRss(rss, feed.url, feed.id);
          if (loadFeed.date !== feed.date) {
            feed.date = loadFeed.date;
            const postsFromStateByFeedId = state.posts.filter((post) => post.idFeed === feed.id);
            const diff = differenceBy(posts, postsFromStateByFeedId, 'description');
            state.posts.push(...diff);
          }
           // addListenerForModal(state);
        })
        .then(() => setTimeout(() => updateRss(state, i18), 5000))
        .catch((error) => {
          state.urlForm.status = 'error';
          state.urlForm.errors = error.message;
        });
    });
  } else {
    setTimeout(() => updateRss(state, i18), 5000);
  }
};
