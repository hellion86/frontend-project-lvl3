import 'bootstrap/dist/css/bootstrap.min.css';
import keyBy from 'lodash/keyBy.js';
import * as yup from 'yup';
import onChange from 'on-change';

// добавить начальное состояние
// форма пустая с фокусом ввода в неё

const state = {
	form: {
		feeds: '',
	},
	valid: true,
	errors: [],
};



// const schema = yup.object().shape({
//   //feed: yup.string().trim().required()
// 	feeds: yup.string().url(),
//   // email: yup.string().required().email(),
//   // password: yup.string().required().min(6),
//   // passwordConfirmation: yup.string()
//   //  .required('password confirmation is a required field')
//   //  .oneOf(
//   //    [yup.ref('password'), null],
//   //    'password confirmation does not match to password',
//   //  ),
// });


const regMatch = /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;
const schema = yup.object({ url: yup.string().url() });
//matches(regMatch, 'Website should be a valid URL')
//const schema = yup.object({
// console.log(schema.isValidSync(12345)) // (true) This is valid.
// console.log(schema.isValidSync(00123)) /

// получить инпут формы
// повешать обработчик, который вносит данные в стейт при измении формы


// этот вотчер следит за изменением стейта и будет проверять валидность ссылки
const watchedState = onChange(state, () => {
	console.log(state);
	// const resultValidation = validate(state.registrationForm.data);
	// allInputs.forEach((input) => {
	// 	const errorDiv = input.closest('.form-group').querySelector('#errorPlace');
	// 	if (has(resultValidation, input.name)) {
	// 		input.classList.add('is-invalid');
	// 		errorDiv.classList.add('invalid-feedback');
	// 		errorDiv.textContent = resultValidation[input.name].message;
	// 	} else {
	// 		errorDiv.textContent = '';
	// 		errorDiv.classList.remove('invalid-feedback');
	// 		input.classList.remove('is-invalid');
	// 	}
	// });
	// const submitFormButton = document.querySelector('.btn-primary');
	// submitFormButton.disabled = !isEmpty(resultValidation);
});
// const validate = (field) => {
//   // try {
//   //   schema.validateSync(fields, { abortEarly: false });
//   //   return {};
//   // } catch (e) {
//   //   return keyBy(e.inner, 'path');
//   // }

// 	schema.validate(field, { abortEarly: false })
// 	.then((result) => {
// 		console.log('ok');
// 		console.log(result);
		
// 		watchedState.feeds = result;
// 		watchedState.form.valid = true;
// 	})
// 	.catch((err) => {
// 		console.log(keyBy(err.inner, 'path'));
// 		watchedState.feeds = '';
// 		watchedState.form.valid = false;
// 	});
// };


const mainForm = document.querySelector('form');
mainForm.addEventListener('submit', (e) => {
	e.preventDefault();
	// console.log(e.target);
	// console.log(e.target);
	const formData = new FormData(e.target);
	const urlFromForm = formData.get('url');
	state.form.feeds = urlFromForm;
	//validate(urlFromForm);
	schema.validate(state.form).then(console.log).catch((err) => console.log(err));
	//console.log(formData.get('url'));
	//state.feeds = urlFromForm;
	//console.log(state);
	//fsp.readFile(src, 'utf-8').then((content) => console.log(content));
	//const resultValidation = schema.isValidSync(state.feeds);
	//console.log(resultValidation);
	//watchedState.registrationForm.data[e.target.name] = e.target.value;
	





	



	
	// schema.isValid(urlFromForm)
	// 	.then((result) => {
	// 		//watchedState.form.errors.push(!result);
	// 		watchedState.feeds = urlFromForm;
	// 		watchedState.form.valid = true;
	// 	})
	// 	.catch(() => {
	// 		watchedState.form.valid = false;
	// 	});
	

	// 
	// state.registrationForm.state = false;
	// axios.post(routes.usersPath(), state.registrationForm.data)
	// 	.then((responce) => {
	// 		document.body.innerHTML = '<div data-container="sign-up">User Created!</div>';
	// 	})
	// 	.catch((error) => {
	// 		console.log(error);
	// 	});
});
