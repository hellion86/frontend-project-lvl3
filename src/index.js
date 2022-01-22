import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import onChange from 'on-change';

// добавить начальное состояние
// форма пустая с фокусом ввода в неё

const state = {
	feeds: [],
	form: {
		valid: true,
		errors: [],
	},
};



const schema = yup.object().shape({
  name: yup.string().trim().required(),
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
  passwordConfirmation: yup.string()
    .required('password confirmation is a required field')
    .oneOf(
      [yup.ref('password'), null],
      'password confirmation does not match to password',
    ),
});

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};


// получить инпут формы
// повешать обработчик, который вносит данные в стейт при измении формы


// этот вотчер следит за изменением стейта и будет проверять валидность ссылки
const watchedState = onChange(state, () => {
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
