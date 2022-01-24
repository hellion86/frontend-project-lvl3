import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import onChange from 'on-change';

// добавить начальное состояние
// форма пустая с фокусом ввода в неё

const state = {
	form: {
		url: '',
	},
	valid: true,
};
const schema = yup.object({ url: yup.string().url() });
const elements = {
	mainForm: document.querySelector('form'),
	dangerZone: document.querySelector('.feedback'),
	mainFormUrlInput: document.querySelector('#url-input'),
};

// получить инпут формы
// повешать обработчик, который вносит данные в стейт при измении формы
// этот вотчер следит за изменением стейта и будет проверять валидность ссылки
const watchedState = onChange(state, () => {
	schema.validate(state.form).then(() => {
		state.valid = true;
		elements.dangerZone.textContent = '';
		elements.mainFormUrlInput.classList.remove('is-invalid');
	}).catch(() => {
		elements.dangerZone.textContent = 'Ссылка должна быть валидным URL';
		state.valid = false;
		elements.mainFormUrlInput.classList.add('is-invalid');
	});
});

elements.mainForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const formData = new FormData(e.target);
	const urlFromForm = formData.get('url');
	watchedState.form.url = urlFromForm;
});
