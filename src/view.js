import { isEmpty, keyBy } from 'lodash';
import onChange from 'on-change';
import * as yup from 'yup';

export const validAsync = (url) => {
	const schema = yup.object({ url: yup.string().url().notOneOf(url.loadedUrl)});
	return schema.validate(url, { abortEarly: false }).then(() => {}).catch((err) => keyBy(err.inner, 'path'));
}


// export default (state, elements) => {
// 	const schema = yup.object({ url: yup.string().url() });


// 	return onChange(state, () => {
// 		schema.validate(state.urlForm).then(() => {
// 			state.urlForm.valid = true;
// 			elements.dangerZone.textContent = '';
// 			elements.mainFormUrlInput.classList.remove('is-invalid');
// 		}).catch((err) => {
// 			elements.dangerZone.textContent = err;
// 			//    err.name   // 'ValidationError'
//     		//err.errors // => ['age must be a number']
// 			state.urlForm.valid = false;
// 			elements.mainFormUrlInput.classList.add('is-invalid');
// 		});
// 	});
// };

// var schema = yup.mixed().oneOf(['jimmy', 42]);
// schema.isValid(42)       //=> true
// schema.isValid('jimmy')  //=> true
// schema.isValid(new Date) //=> false
export const handleErrors = (elements, value, prev) => {
	// console.log('errors handle!');
	// console.log('elements :');
	// console.log(elements.dangerZone.textContent);
	// console.log('value');
	// console.log(value);
	// console.log(value.url.message);
	// console.log('prev');
	// console.log(prev);
	// const urlWasBad = isEmpty(prev);
	const errorsType = {
		url: 'Ссылка должна быть валидным URL',
		notOneOf: 'Rss уже существует',
	};
	
	const urlIsBad = isEmpty(value);
	if (!urlIsBad) {
		elements.dangerZone.textContent = errorsType[value];
		elements.mainFormUrlInput.classList.add('is-invalid');
	} else {
		elements.mainForm.reset();
		elements.mainFormUrlInput.focus();
		elements.dangerZone.textContent = '';
		elements.mainFormUrlInput.classList.remove('is-invalid');
	}
};

