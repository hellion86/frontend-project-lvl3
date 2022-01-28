/* eslint-disable no-param-reassign */
import { isEmpty, keyBy } from 'lodash';
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
	return schema.validate(url, { abortEarly: false }).then(() => {}).catch((err) => keyBy(err.inner, 'name'));
};

export const handleErrors = (elements, value) => {
	const urlIsBad = isEmpty(value);
	if (!urlIsBad) {
		elements.dangerZone.textContent = value;
		elements.dangerZone.classList.add('text-danger');
		elements.mainFormUrlInput.classList.add('is-invalid');
		elements.dangerZone.classList.remove('text-success');
	}
};

export const handleProcessLoading = (elements, val, i18nextInstance) => {
	elements.mainForm.reset();
	elements.mainFormUrlInput.focus();
	elements.dangerZone.textContent = i18nextInstance.t('urlLoadSuccess');
	elements.dangerZone.classList.add('text-success');
	elements.dangerZone.classList.remove('text-danger');
	elements.mainFormUrlInput.classList.remove('is-invalid');
};

export const render = (elements, i18nextInstance) => (path, value) => {
	switch (path) {
		case 'urlForm.errors':
			handleErrors(elements, value);
			break;
		case 'urlForm.loadedUrl':
			handleProcessLoading(elements, value, i18nextInstance);
			break;
		default:
			break;
	}
};
