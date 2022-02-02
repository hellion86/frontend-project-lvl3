/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import 'bootstrap/dist/css/bootstrap.min.css';
import onChange from 'on-change';
import i18n from 'i18next';
import { concat } from 'lodash';
import {
	render, loadUrl, parserUrl, validateUrl,
} from './view.js';
import { makePosts, makeFeeds } from './utils.js';
import ru from './locales/ru.js';

const app = (i18) => {
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
			errors: {},
			addButtonShow: false,
		},
		feeds: [],
		posts: [],
	}, render(elements, i18));

	const update = () => {
		if (state.urlForm.loadedUrl.length !== 0) {
			state.feeds.map((feed) => {
				loadUrl(feed.url)
					.then((rss) => {
						const dataFeed = parserUrl(rss, i18);
							if (dataFeed.querySelector('pubDate').textContent !== feed.date) {
								const newPosts = makePosts(dataFeed, feed.id);
								feed.date = dataFeed.querySelector('pubDate').textContent;
								const otherPosts = state.posts.filter((post1) => post1.idFeed !== feed.id);
								state.posts = concat(newPosts, otherPosts).sort((a, b) => a.idFeed - b.idFeed);
							}
					}).catch((error) => { state.urlForm.errors = error.message; });
			});
		}
		setTimeout(update, 5000);
	};
	update();

	elements.mainForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		state.urlForm.url = formData.get('url');
		state.urlForm.addButtonShow = true;
		validateUrl(state.urlForm, i18)
			.then((data) => loadUrl(data.url))
			.then((rss) => {
				const parsedRss = parserUrl(rss, i18);
				const feeds = makeFeeds(parsedRss, state.urlForm.url);
				const posts = makePosts(parsedRss, feeds.id);
				state.urlForm.loadedUrl.push(state.urlForm.url);
				state.feeds.push(feeds);
				state.posts.push(...posts);
			})
			.catch((error) => { state.urlForm.errors = error.message; })
			.then(() => { state.urlForm.addButtonShow = false; });
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
