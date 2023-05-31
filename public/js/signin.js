const signInForm = document.getElementById('signin-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const alertText = document.getElementById('alert-text');
// import { setAlert } from './alert.js';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000'
});
signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = {
        email: emailInput.value,
        password: passwordInput.value
    };

    try {
        const result = await axiosInstance.post('/user/signin', user);
        
        setAlert(result);
    } catch(err) {
        setAlert(err.response);
        console.clear();
    }
});
function setAlert(result) {

    if(!result.data.success) {
        alertText.innerText = result.data.message;
        if(alertText.classList.contains('alert-success'))
            alertText.classList.remove('alert-success');
        if(!alertText.classList.contains('alert-danger'))
            alertText.classList.add('alert-danger');
        alertText.hidden = "";
    }
    else {
        alertText.innerText = alertTextPass;
        alertText.innerText = result.data.message;
        if(alertText.classList.contains('alert-danger'))
            alertText.classList.remove('alert-danger');
        if(!alertText.classList.contains('alert-success'))
            alertText.classList.add('alert-success');
        alertText.hidden = "";
    }
    signInForm.reset();
    setTimeout(() => {
        alertText.hidden = "hidden";
    }, 5000);
}