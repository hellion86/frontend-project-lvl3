import 'bootstrap/dist/css/bootstrap.min.css';
import { isEmpty, keyBy } from 'lodash';
import onChange from 'on-change';
//import { validate } from 'schema-utils';
import * as yup from 'yup';
//import has from 'lodash/has.js';
import { handleErrors, validAsync } from './view.js';

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
// const validateUrl = (url) => {
// 	const schema = yup.object({ url: yup.string().url().notOneOf(url.loadedUrl)});
// 	try {
//     schema.validateSync(url, { abortEarly: false });
//     return {};
//   } catch (e) {
// 	 // console.log(e);
//     return keyBy(e.inner, 'path');
//   }
// };


// const handleErrors = (elements, value, prev) => {
// 	// console.log('errors handle!');
// 	// console.log('elements :');
// 	// console.log(elements.dangerZone.textContent);
// 	// console.log('value');
// 	// console.log(value);
// 	// console.log(value.url.message);
// 	// console.log('prev');
// 	// console.log(prev);
// 	// const urlWasBad = isEmpty(prev);
// 	const errorsType = {
// 		url: 'Ссылка должна быть валидным URL',
// 		notOneOf: 'Rss уже существует',
// 	};
	
// 	const urlIsBad = isEmpty(value);
// 	if (!urlIsBad) {
// 		elements.dangerZone.textContent = errorsType[value];
// 		elements.mainFormUrlInput.classList.add('is-invalid');
// 	} else {
// 		elements.mainForm.reset();
// 		elements.mainFormUrlInput.focus();
// 		elements.dangerZone.textContent = '';
// 		elements.mainFormUrlInput.classList.remove('is-invalid');
// 	}
// };

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
		addFeedButton: document.querySelector('button'),
	};

	const state = onChange({
		urlForm: {
			loadedUrl: [],
			validUrl:'',
			url: '',
			errors: {},
		},
	}, render(elements));

	elements.mainForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const getUrl = formData.get('url');
		state.urlForm.url = getUrl;
		validAsync(state.urlForm)
			.then((errors) => {
				if (isEmpty(errors)) {
					state.urlForm.loadedUrl.push(getUrl);
					state.urlForm.errors = {};
				} else {
					state.urlForm.errors = errors.url.type;
				}
			});
		//	const errors= validateUrl(state.urlForm);			
		//	const {url[type] }= validateUrl(state.urlForm);
		//	const type = errors.url.type;
		//	const value = errors.url.value;
		//	console.log(type);
		//	console.log(value);
		
		// if (isEmpty(errors)) {
		// 	state.urlForm.loadedUrl.push(getUrl);
		// 	state.urlForm.errors = {};		
		// } else {
		// 	//console.log(errors);
		// 	state.urlForm.errors = errors.url.type;		
		// }


		//console.log(state.urlForm);
		//console.log(state.urlForm);
		//watcher.urlForm.loadedUrl.push(getUrl);
	});
};

app();
