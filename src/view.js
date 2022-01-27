import { isEmpty, keyBy } from 'lodash';
import onChange from 'on-change';
import * as yup from 'yup';
import { setLocale } from 'yup';

export const validAsync = (url, i18nextInstance) => {
	setLocale({
		string: {
			url: i18nextInstance.t('urlError')
		},
		mixed: {
			notOneOf: i18nextInstance.t('urlExist')
		},
		//success: i18nextInstance.t('urlLoadSuccess')
	})
	
	//.notOneOf(url.loadedUrl) 
	const schema = yup.object({ 
		url: yup.string().url(),
		checkLoadedUrl: yup.mixed().notOneOf(url.loadedUrl)
	});
	return schema.validate(url, { abortEarly: false }).then(() => {}).catch((err) => keyBy(err.inner, 'type'));
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
export const handleErrors = (elements, value, i18nextInstance) => {
	// console.log('errors handle!');
	// console.log('elements :');
	// console.log(elements.dangerZone.textContent);
	// console.log('value');
	// console.log(value);
	//console.log(value);
	// console.log('prev');
	// console.log(prev);
	// const urlWasBad = isEmpty(prev);

	


	////------------
	// const errorsType = {
	// 	url: i18nextInstance.t('urlError'),
	// 	notOneOf: i18nextInstance.t('urlExist'),
	// 	success: i18nextInstance.t('urlLoadSuccess'),
	// };
	
	const urlIsBad = isEmpty(value);
	
	if (!urlIsBad) {
		console.log(value);
		// elements.dangerZone.textContent = errorsType[value];
		// elements.dangerZone.classList.add('text-danger');
		// elements.mainFormUrlInput.classList.add('is-invalid');
		// elements.dangerZone.classList.remove('text-success');
	} else {
		console.log(i18nextInstance.t('urlLoadSuccess'))
		// elements.mainForm.reset();
		// elements.mainFormUrlInput.focus();
		// elements.dangerZone.textContent = errorsType['success'];
		// elements.dangerZone.classList.add('text-success');
		// elements.dangerZone.classList.remove('text-danger');
		// elements.mainFormUrlInput.classList.remove('is-invalid');
	}
};

