import 'bootstrap/dist/css/bootstrap.min.css';
import stateWatcher from './view.js';

const state = {
	urlForm: {
		url: '',
		valid: true,
	},
};

const elements = {
	mainForm: document.querySelector('form'),
	dangerZone: document.querySelector('.feedback'),
	mainFormUrlInput: document.querySelector('#url-input'),
};

const watcher = stateWatcher(state, elements);

elements.mainForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const formData = new FormData(e.target);
	const getUrl = formData.get('url');
	watcher.urlForm.url = getUrl;
});
