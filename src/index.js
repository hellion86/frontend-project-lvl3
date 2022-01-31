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
	}, render(elements, i18nextInstance));

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
				const dataFeed = parserUrl(rss);
				if (dataFeed.querySelector('parsererror')) {
					state.urlForm.errors = i18nextInstance.t('badRss');
					} else {
						state.urlForm.loadedUrl.push(getUrl);
						const feeds = makeFeeds(dataFeed);
						const posts = makePosts(dataFeed, feeds.id);
						state.feeds.push(feeds);
						state.posts.push(...posts);
					}
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
