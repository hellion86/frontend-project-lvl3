/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import 'bootstrap/dist/css/bootstrap.min.css';
import onChange from 'on-change';
import i18n from 'i18next';
import { concat, differenceWith, isEqual } from 'lodash';
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
			errors: {},
		},
		feeds: [],
		posts: [],
	}, render(elements, i18nextInstance));

	const update = () => {
		if (state.urlForm.loadedUrl.length !== 0) {
		state.feeds.map((feed) => {
				loadUrl(feed.url)
					.then((rss) => {
						const dataFeed = parserUrl(rss, i18nextInstance);
							if (dataFeed.querySelector('pubDate').textContent !== feed.date) {
								// ссылки для тестов, 1ая обновляется каждые 10 сек, вторая раз в сутки
								// https://lorem-rss.herokuapp.com/feed?unit=second&interval=10
								// http://feeds.bbci.co.uk/news/world/rss.xml
								// делаю новый список постов по измененному фиду
								const newPosts = makePosts(dataFeed, feed.id);
								// выбираю все оставшиеся посты, тут приходит в консоль браузера Proxy объекты
								const otherPosts = state.posts.filter((post1) => post1.idFeed !== feed.id);
								// console.log(otherPosts);
								// const diff = differenceWith(state.posts, newPosts, isEqual);
								// console.log(diff);
								const result = concat(newPosts, otherPosts);
								console.log(result);
								feed.date = dataFeed.querySelector('pubDate').textContent;
								// state.posts = result;
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
		const getUrl = formData.get('url');
		state.urlForm.url = getUrl;
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
				// console.log(posts)
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
