import 'bootstrap/dist/css/bootstrap.min.css';
import onChange from 'on-change';
import * as yup from 'yup';
//import has from 'lodash/has.js';
//import stateWatcher from './view.js';

const state = {
	urlForm: {
		loadedUrl: [],
		url: '',
		validLoaded: true,
		validUrl: true,
		errors: '',
	},
};

const schema = yup.object({
	url: yup.string().url(),
});

 const watcher = onChange(state, (path, value) => {
	
	if (path === 'urlForm.loadedUrl') {
		const linkExist = state.urlForm.loadedUrl.includes(state.urlForm.url);
		console.log(linkExist);
		state.urlForm.validLoaded = linkExist;
	};

	if (path === 'urlForm.url') {
		schema.validate(state.urlForm)
			.then(() => {
				state.urlForm.validUrl = true;
				state.urlForm.errors = '';
			})
			.catch((err) => {
				state.urlForm.validUrl = false;
				state.urlForm.errors = err;
			})
	};

	console.log(state);
// 	schema.validate(state.urlForm).then((item) => {
// 		console.log(state.urlForm.loadedUrl.includes(item.url));
// 		state.urlForm.loadedUrl.push(item.url);
// 		state.urlForm.valid = true;
// 		elements.dangerZone.textContent = '';
// 		elements.mainFormUrlInput.classList.remove('is-invalid');
// 		console.log(state);
// 		//console.log(state.urlForm);
// 		//elements.mainFormUrlInput.reset();
// 		//elements.mainFormUrlInput.focus();
// 	}).catch((err) => {
// 		console.log(err.errors);
// 		elements.dangerZone.textContent = 'Ссылка должна быть валидным URL';
// 		state.urlForm.valid = false;
// 		elements.mainFormUrlInput.classList.add('is-invalid');
// 	});
});

const elements = {
	mainForm: document.querySelector('form'),
	dangerZone: document.querySelector('.feedback'),
	mainFormUrlInput: document.querySelector('#url-input'),
};

//const watcher = stateWatcher(state, elements);

elements.mainForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const formData = new FormData(e.target);
	const getUrl = formData.get('url');
	watcher.urlForm.url = getUrl;
	watcher.urlForm.loadedUrl.push(getUrl);
});
