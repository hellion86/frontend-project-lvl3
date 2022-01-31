/* eslint-disable no-param-reassign */
import { isEmpty } from 'lodash';
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
	if (!isEmpty(value)) {
		if (value === 'Network Error') {
			elements.dangerZone.textContent = i18nextInstance.t('netWorkError');
		} else {
			elements.dangerZone.textContent = value;
		}
		elements.dangerZone.classList.add('text-danger');
		elements.mainFormUrlInput.classList.add('is-invalid');
		elements.dangerZone.classList.remove('text-success');
	} else {
		elements.mainForm.reset();
		elements.mainFormUrlInput.focus();
		elements.dangerZone.textContent = i18nextInstance.t('urlLoadSuccess');
		elements.dangerZone.classList.add('text-success');
		elements.dangerZone.classList.remove('text-danger');
		elements.mainFormUrlInput.classList.remove('is-invalid');
	}
};

export const loadUrl = (link) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(link)}`);

const renderFeed = (elements, value) => {
	//console.log(value[0].feeds)
	const preparePostsLi = value.map((item) => (
		`<li class="list-group-item border-0 border-end-0">
		<h3 class="h6 m-0">${item.post.title}</h3>
		<p class="m-0 small text-black-50">${item.post.description}</p>
		</li>`
	)).join('');
	const postsTemplate = `<div class="card border-0"><div class="card-body">
	<h2 class="card-title h4">Фиды</h2></div><ul class="list-group border-0 rounded-0">${preparePostsLi}</ul></div>`;
	elements.feedsPlace.innerHTML = postsTemplate;
	const prepareFeedsLi = value.map((item) => (
		item.feeds.map((el) => (
			`<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
			<a href="${el.link}" class="fw-bold" data-id="${el.id}" target="_blank" rel="noopener noreferrer">${el.title}</a>
			</li>`
		)).join('')
	));


	// <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
	//   <a href="https://ru.hexlet.io/courses/python-basics/lessons/stdlib/theory_unit" class="fw-bold" data-id="2" target="_blank" rel="noopener noreferrer">Стандартная билиотека / Python: Основы программирования</a>
	//   <button type="button" class="btn btn-outline-primary btn-sm" data-id="2" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>
	// </li>

	const feedsTemplate = `<div class="card border-0"><div class="card-body"><h2 class="card-title h4">Посты</h2></div>
  	<ul class="list-group border-0 rounded-0">${prepareFeedsLi}</ul></div>`;
	elements.postsPlace.innerHTML = feedsTemplate;
};

export const render = (elements, i18nextInstance) => (path, value) => {
	switch (path) {
		case 'urlForm.errors':
			handleErrors(elements, value, i18nextInstance);
			break;
		case 'feeds':
			renderFeed(elements, value);
			break;
		default:
			break;
	}
};


// export const loadFeeds = (state, getUrl, elements, i18nextInstance) => {
// 	//elements.addFeedButton.setAttribute('disabled', true);
// 	return axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(getUrl)}`)
// 		.then((response) => {
// 			const parsed = parserUrl(response);
// 			if (parsed.querySelector('parsererror')) {
// 				handleErrors(elements, i18nextInstance.t('badRss'));
// 			} else {
// 				console.log(state);
// 				state.urlForm.loadedUrl.push(getUrl);
// 				elements.mainForm.reset();
// 				elements.mainFormUrlInput.focus();
// 				elements.dangerZone.textContent = i18nextInstance.t('urlLoadSuccess');
// 				elements.dangerZone.classList.add('text-success');
// 				elements.dangerZone.classList.remove('text-danger');
// 				elements.mainFormUrlInput.classList.remove('is-invalid');
// 			}
// 		})
// 		.catch(() => handleErrors(elements, i18nextInstance.t('netWorkError')))
// 		//.then(() => { elements.addFeedButton.disabled = false; });
// };

// export const handleProcessLoading = (elements, val, i18nextInstance) => {
// 	elements.addFeedButton.setAttribute('disabled', true);
// 	axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(last(val))}`)
// 		.then((response) => {
// 			const parsed = parserUrl(response);
// 			if (parsed.querySelector('parsererror')) {
// 				handleErrors(elements, i18nextInstance.t('badRss'));
// 			} else {
// 				console.log(parsed);
// 			}
// 		})
// 		.catch((err) => console.log(err))
// 		.then(() => { elements.addFeedButton.disabled = false; });
// 	elements.mainForm.reset();
// 	elements.mainFormUrlInput.focus();
// 	elements.dangerZone.textContent = i18nextInstance.t('urlLoadSuccess');
// 	elements.dangerZone.classList.add('text-success');
// 	elements.dangerZone.classList.remove('text-danger');
// 	elements.mainFormUrlInput.classList.remove('is-invalid');
// };


