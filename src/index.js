/* eslint-disable no-param-reassign */
import 'bootstrap/dist/css/bootstrap.min.css';
import onChange from 'on-change';
import i18n from 'i18next';
import {
	validAsync, render, loadUrl, parserUrl,
} from './view.js';
import { makePosts, makeFeeds } from './utils.js';
import ru from './locales/ru.js';

const app = (i18nextInstance) => {
	const elements = {
		mainForm: document.querySelector('form'),
		dangerZone: document.querySelector('.feedback'),
		mainFormUrlInput: document.querySelector('#url-input'),
		addFeedButton: document.querySelector('[aria-label="add"]'),
		postsPlace: document.querySelector('.posts'),
		feedsPlace: document.querySelector('.feeds'),
	};

	const state = onChange({
		urlForm: {
			loadedUrl: [],
			validUrl: '',
			url: '',
			checkLoadedUrl: '',
			errors: {},
		},
		feeds: [],
		posts: [],
		updatePosts: [],
	}, render(elements, i18nextInstance));

	const update = () => {
		if (state.urlForm.loadedUrl.length !== 0) {
			// feeds.map((feed) => {
			// loadUrl(feed.url)
			// .then((rss) => {
			// 		const data1Feed = parserUrl(rss, i18nextInstance);
			// 		state.posts = [];
			// 		if (data1Feed.querySelector('pubDate').textContent !== feed.date) {
			// 			const newPosts = makePosts(data1Feed, feed.id);
			// 			feed.date = data1Feed.querySelector('pubDate').textContent;
			// 			state.posts.push(...newPosts);
			// 		} else {
			// 			const otherPosts = makePosts(data1Feed, feed.id);
			// 			state.posts.push(...otherPosts);
			// 		}
			// 	});
			// });
		}
		// console.log(state.updatePosts);
		setTimeout(update, 5000);
	};
	update();

	elements.mainForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const getUrl = formData.get('url');
		state.urlForm.url = getUrl;
		state.urlForm.checkLoadedUrl = getUrl;
		elements.addFeedButton.setAttribute('disabled', true);
		validAsync(state.urlForm, i18nextInstance)
			.then((data) => loadUrl(data.url))
			.then((rss) => {
				// console.log(rss)
				const dataFeed = parserUrl(rss, i18nextInstance);
				// console.log(dataFeed)
				const feeds = makeFeeds(dataFeed, state.urlForm.url);
				const posts = makePosts(dataFeed, feeds.id);
				// console.log(posts)
				state.urlForm.loadedUrl.push(getUrl);
				state.feeds.push(feeds);
				state.posts.push(...posts);
				// console.log(state.posts)
			})
			.catch((error) => { state.urlForm.errors = error.message; })
			.then(() => { elements.addFeedButton.disabled = false; });
	});
};

const runApp = () => {
	const i18nextInstance = i18n.createInstance();
	i18nextInstance.init({
		lng: 'ru',
		resources: { ru },
	}).then(() => app(i18nextInstance));
};

runApp();
