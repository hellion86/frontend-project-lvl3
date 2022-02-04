/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import 'bootstrap/dist/css/bootstrap.min.css';
import onChange from 'on-change';
import i18n from 'i18next';
import { concat, find } from 'lodash';
import {
	render, loadUrl, parserUrl, validateUrl,
} from './view.js';
import { makePosts, makeFeeds } from './utils.js';
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
			loadedUrl: [],
			validUrl: '',
			url: '',
			errors: {},
			addButtonShow: false,
		},
		UIState: {},
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
				const numberOfFeeds = state.urlForm.loadedUrl.length;
				const feeds = makeFeeds(parsedRss, state.urlForm.url, numberOfFeeds);
				const posts = makePosts(parsedRss, feeds.id);
				state.urlForm.loadedUrl.push(state.urlForm.url);
				state.feeds.push(feeds);
				state.posts.push(...posts);
			})
			.then(() => {
				// find buttons add event listener
				const postsButtons = document.querySelectorAll('.btn-outline-primary');
				const divfooter = document.createElement('div');
				divfooter.classList.add('modal-backdrop', 'fade', 'show');
				postsButtons.forEach((button) => {
					button.addEventListener('click', (but) => {
						// find post by button id
						const postId = but.target.getAttribute('data-id');
						const postOnDocument = document.querySelector(`[data-id="${postId}"]`);
						const getPost = find(state.posts, ['id', postId]);
						// replace font if read link
						postOnDocument.classList.replace('fw-bold', 'fw-normal');
						// prepare show modal
							document.body.classList.add('modal-open');
							document.body.setAttribute('style', 'overflow: hidden; padding-right: 16px;');
							document.body.append(divfooter);
						// showModal
							elements.modalForm.classList.add('show');
							elements.modalForm.setAttribute('style', 'display: block;');
							elements.modalForm.removeAttribute('aria-hidden');
							elements.modalForm.setAttribute('aria-modal', 'true');
							elements.modalForm.setAttribute('role', 'dialog');
						// put data from post to modal
							elements.modalTitle.textContent = getPost.title;
							elements.modalBody.textContent = getPost.description;
							elements.modalReadButton.setAttribute('href', getPost.link);
					});
				});
				// add listener to close modal form
				elements.modalCloseButton.forEach((closeBtn) => {
					closeBtn.addEventListener('click', () => {
						document.body.classList.remove('modal-open');
						document.body.setAttribute('style', '');
						document.body.removeChild(divfooter);
						elements.modalForm.classList.remove('show');
						elements.modalForm.setAttribute('style', 'display: none;');
						elements.modalForm.setAttribute('aria-hidden', 'true');
						elements.modalForm.removeAttribute('aria-modal');
						elements.modalForm.removeAttribute('role');
						elements.modalTitle.textContent = '';
						elements.modalBody.textContent = '';
						elements.modalReadButton.setAttribute('href', '#');
					});
				});
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
