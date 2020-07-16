import { isTokenValid } from "./jwt.js";
import Menu from './Menu.js';
import EventStore from './EventStore.js';
import { html, render } from './lib/lit-html.js';
import { dFull } from './fmt.js';

const renderEvent = (evt) => {
    const view = document.querySelector('article');
    const template = html`
        <div class="card-header">
            <p class="card-header-title">${dFull(evt.quando)}</p>
            <p >${evt.luogo}</p>
        </div>
        <div class="card-content">
            <div class="content">
                <p><strong>${evt.categoria}</strong></p>
                <p class="subtitle">${evt.titolo}</p>
            </div>
        </div>
    `;
    render(template, view);
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
        });
}

const url = new URL(document.location.href);
const eventId = url.searchParams.get('eventId');
const store = new EventStore();
const form = document.querySelector('form');
form.addEventListener("submit", onPrenota);
store.find(eventId)
    .then(json => renderEvent(json));