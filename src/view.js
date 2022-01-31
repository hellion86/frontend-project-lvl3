/* eslint-disable no-param-reassign */
import * as axios from 'axios';
import * as yup from 'yup';
import { setLocale } from 'yup';

export const validAsync = (url, i18nextInstance) => {
	setLocale({
		string: {
			url: i18nextInstance.t('urlError'),
		},
		mixed: {
			notOneOf: i18nextInstance.t('urlExist'),
		},
	});
	const schema = yup.object({
		url: yup.string().url(),
		checkLoadedUrl: yup.mixed().notOneOf(url.loadedUrl),
	});
	return schema.validate(url, { abortEarly: false });
};

export const parserUrl = (url) => {
	const parser = new DOMParser();
	return parser.parseFromString(url.data.contents, 'text/xml');
};

export const handleErrors = (elements, value, i18nextInstance) => {
	if (value === 'Network Error') {
		elements.dangerZone.textContent = i18nextInstance.t('netWorkError');
	} else {
		elements.dangerZone.textContent = value;
	}
	elements.dangerZone.classList.add('text-danger');
	elements.mainFormUrlInput.classList.add('is-invalid');
	elements.dangerZone.classList.remove('text-success');
};

export const loadUrl = (link) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(link)}`);

const cleanForm = (elements, i18nextInstance) => {
	elements.mainForm.reset();
	elements.mainFormUrlInput.focus();
	elements.dangerZone.textContent = i18nextInstance.t('urlLoadSuccess');
	elements.dangerZone.classList.add('text-success');
	elements.dangerZone.classList.remove('text-danger');
	elements.mainFormUrlInput.classList.remove('is-invalid');
};

const showPosts = (elements, value) => {
	const preparePosts = value.map((post) => (
		`<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
		<a href="${post.link}" class="fw-bold" data-id="${post.id}" target="_blank" rel="noopener noreferrer">${post.title}</a>
		</li>`
	)).join('');
	const postsTemplate = `<div class="card border-0"><div class="card-body"><h2 class="card-title h4">Посты</h2></div>
	<ul class="list-group border-0 rounded-0">${preparePosts}</ul></div>`;
	elements.postsPlace.innerHTML = postsTemplate;
};

const showFeeds = (elements, value) => {
	const prepareFeed = value.map((feed) => (
	`<li class="list-group-item border-0 border-end-0">
	<h3 class="h6 m-0">${feed.title}</h3>
	<p class="m-0 small text-black-50">${feed.description}</p></li>`
	)).join('');
	const feedTemplate = `<div class="card border-0"><div class="card-body">
	<h2 class="card-title h4">Фиды</h2></div><ul class="list-group border-0 rounded-0">${prepareFeed}</ul></div>`;
	elements.feedsPlace.innerHTML = feedTemplate;
};

export const render = (elements, i18nextInstance) => (path, value) => {
	switch (path) {
		case 'urlForm.errors':
			handleErrors(elements, value, i18nextInstance);
			break;
		case 'feeds':
			showFeeds(elements, value);
			cleanForm(elements, i18nextInstance);
			break;
		case 'posts':
			showPosts(elements, value);
			break;
		default:
			break;
	}
};
