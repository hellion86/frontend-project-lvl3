import 'bootstrap/dist/css/bootstrap.min.css';
import { isEmpty, keyBy } from 'lodash';
import onChange from 'on-change';
//import { validate } from 'schema-utils';
import * as yup from 'yup';
//import has from 'lodash/has.js';
//import stateWatcher from './view.js';





// const watcher = onChange(state, (path, value) => {
// 	if (path === 'urlForm.loadedUrl') {
// 		const linkExist = state.urlForm.loadedUrl.includes(state.urlForm.url);
// 		console.log(linkExist);
// 		state.urlForm.validLoaded = linkExist;
// 	}

// 	if (path === 'urlForm.url') {
// 		schema.validate(state.urlForm)
// 			.then(() => {
// 				state.urlForm.validUrl = true;
// 				state.urlForm.errors = '';
// 			})
// 			.catch((err) => {
// 				state.urlForm.validUrl = false;
// 				state.urlForm.errors = err;
// 			})
// 	}

// 	console.log(state);
// // 	schema.validate(state.urlForm).then((item) => {
// // 		console.log(state.urlForm.loadedUrl.includes(item.url));
// // 		state.urlForm.loadedUrl.push(item.url);
// // 		state.urlForm.valid = true;
// // 		elements.dangerZone.textContent = '';
// // 		elements.mainFormUrlInput.classList.remove('is-invalid');
// // 		console.log(state);
// // 		//console.log(state.urlForm);
// // 		//elements.mainFormUrlInput.reset();
// // 		//elements.mainFormUrlInput.focus();
// // 	}).catch((err) => {
// // 		console.log(err.errors);
// // 		elements.dangerZone.textContent = 'Ссылка должна быть валидным URL';
// // 		state.urlForm.valid = false;
// // 		elements.mainFormUrlInput.classList.add('is-invalid');
// // 	});
// });

const schema = yup.object({ url: yup.string().url() });

const validateUrl = (url) => {
	try {
    schema.validateSync(url, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

const handleErrors = (elements, value, prev) => {
	//console.log('errors handle!');
	console.log('elements :');
	console.log(elements.dangerZone.textContent);
	console.log('value');
	console.log(value.url);
	console.log('prev');
	console.log(prev);
	const urlWasBad = isEmpty(prev);
	const urlIsBad = isEmpty(value);

	// if (urlIsBad && urlWasBad) {
	// 	elements.dangerZone.textContent = value.url;
	// }

};

const render = (elements) => (path, value, prev) => {
	switch (path) {
		case 'urlForm.errors':
 			handleErrors(elements, value, prev);
			break;
		case 'urlForm.validUrl':
			break;
		default:
			break;
	}
};

const app = () => {
	const elements = {
		mainForm: document.querySelector('form'),
		dangerZone: document.querySelector('.feedback'),
		mainFormUrlInput: document.querySelector('#url-input'),
	};

	const state = onChange({
		urlForm: {
			loadedUrl: [],
			processState: 'filling',
			url: '',
			validLoaded: true,
			validUrl: true,
			errors: {},
		},
	}, render(elements));

	elements.mainForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const getUrl = formData.get('url');
		state.urlForm.url = getUrl;
		const errors = validateUrl(state.urlForm);
		//console.log(errors);
		state.urlForm.errors = errors;
		state.urlForm.validUrl = isEmpty(errors);
		//console.log(state.urlForm);
		//watcher.urlForm.loadedUrl.push(getUrl);
	});
};

app();
