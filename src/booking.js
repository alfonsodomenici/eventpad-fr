import { isTokenValid } from "./jwt.js";
import Menu from './Menu.js';
import EventStore from './EventStore.js';
import { html, render } from './lib/lit-html.js';
import { dFull } from './fmt.js';

const updateBreadcrumb = (data) => {
    const bc = document.querySelector('nav.breadcrumb');
    const template = html`
        <ul>
            <li><a href="index.html">Calendario eventi</a></li>
            <li><a href="events.html?data=${data}">${dFull(data)}</a></li>
            <li class="is-active"> 
                <a href="${window.location.href}" aria-current="page">prenotazione</a>
            </li>
        </ul>
    `;
    render(template,bc);
}

const renderEvent = (evt) => {
    updateBreadcrumb(evt.quando);
    const view = document.querySelector('article');
    const template = html`
        <div class="card-header">
            <p class="card-header-title">${dFull(evt.quando)}</p>
            <p >${evt.luogo}</p>
        </div>
        <div class="card-content">
            <div class="content">
                <p><strong>Ore </strong>  ${evt.ora}</p>
                <p><strong>${evt.categoria}</strong></p>
                <p class="subtitle">${evt.titolo}</p>
            </div>
        </div>
    `;
    render(template, view);
}

const renderError = _ => {
    const not = document.querySelector('div.notifiche');
    const template = html`
        <div class="notification is-danger is-light">
            <button @click=${e => onCloseNotifica(e)} class="delete"></button>
            <p class = 'title'> Errore </p>
            <p>Impossibile effettuare la prenotazione</p>
            <p>I dati potrebbero essere già presenti oppure i posti esauriti</p>
        </div>
    `;
    render(template,not);
}

const onCloseNotifica = e => { 
    const not = document.querySelector('div.notifiche');
    render(html``,not);
}

const onPrenota = (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const cognome = document.getElementById("cognome").value;
    const tel = document.getElementById("tel").value;
    const email = document.getElementById("email").value;
    const p = {
        nome,
        cognome,
        tel,
        email
    }
    store.createBooking(eventId, p)
        .then(json => {
            window.location.href = `confirmation.html?eventId=${eventId}&bookingId=${json.id}`;
        })
        .catch(ex => {
            renderError();
        });
}
const url = new URL(document.location.href);
const eventId = url.searchParams.get('eventId');
const store = new EventStore();
const form = document.querySelector('form');
form.addEventListener("submit", onPrenota);
store.find(eventId)
    .then(json => renderEvent(json));