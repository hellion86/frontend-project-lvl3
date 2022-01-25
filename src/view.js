import onChange from 'on-change';
import * as yup from 'yup';


export default (state, elements) => {
	const schema = yup.object({ url: yup.string().url() });


	return onChange(state, () => {
		schema.validate(state.urlForm).then(() => {
			state.urlForm.valid = true;
			elements.dangerZone.textContent = '';
			elements.mainFormUrlInput.classList.remove('is-invalid');
		}).catch((err) => {
			elements.dangerZone.textContent = err;
			//    err.name   // 'ValidationError'
    		//err.errors // => ['age must be a number']
			state.urlForm.valid = false;
			elements.mainFormUrlInput.classList.add('is-invalid');
		});
	});
};

