import 'bootstrap/dist/css/bootstrap.min.css';
import onChange from 'on-change';
import { isEmpty } from 'lodash';
import i18n from 'i18next';
import { validAsync, render, loadFeeds } from './view.js';
import ru from './locales/ru.js';

const app = (i18nextInstance) => {
	const elements = {
		mainForm: document.querySelector('form'),
		dangerZone: document.querySelector('.feedback'),
		mainFormUrlInput: document.querySelector('#url-input'),
		addFeedButton: document.querySelector('[aria-label="add"]'),
	};

	const state = onChange({
		urlForm: {
			loadedUrl: [],
			validUrl: '',
			url: '',
			checkLoadedUrl: '',
			errors: {},
		},
		feeds: {},
	}, render(elements, i18nextInstance));

	elements.mainForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const getUrl = formData.get('url');
		state.urlForm.url = getUrl;
		state.urlForm.checkLoadedUrl = getUrl;
		validAsync(state.urlForm, i18nextInstance)
			.then((errors) => {
				if (isEmpty(errors)) {
					loadFeeds(state, getUrl, elements, i18nextInstance);
				} else {
					state.urlForm.errors = errors.ValidationError.message;
				}
			});
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
