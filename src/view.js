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
	const urlIsBad = isEmpty(value);
	if (!urlIsBad) {
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

export const render = (elements, i18nextInstance) => (path, value) => {
	switch (path) {
		case 'urlForm.errors':
			handleErrors(elements, value, i18nextInstance);
			break;
		//case 'urlForm.loadedUrl':
			//handleProcessLoading(elements, value, i18nextInstance);
			//break;
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


