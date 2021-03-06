import { writeToken } from "./jwt.js";
import AuthenticationStore from './AuthenticationStore.js';
import Menu from './Menu.js';

const onlogin = (e) => {
    e.preventDefault();
    const credential = {
        usr: usrEl.value,
        pwd: pwdEl.value
    }
    store.login(credential)
        .then(json => {
            const { token } = json;
            writeToken(token);
            window.location.href = 'index.html';
        });
}

const store = new AuthenticationStore();
const usrEl = document.getElementById("usr");
const pwdEl = document.getElementById("pwd");
const formEl = document.querySelector('form');

formEl.addEventListener("submit", onlogin);

