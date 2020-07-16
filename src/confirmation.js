import { isTokenValid } from "./jwt.js";
import Menu from './Menu.js';
import EventStore from './EventStore.js';
import { html, render } from './lib/lit-html.js';
import { dFull } from './fmt.js';

const renderEvent = (evt) => {
    const view = document.querySelector('article.event');
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

const renderPerson = (data) => {
    const view = document.querySelector('article.person');
    const template = html`
            <div class="card-header">
                <p class="card-header-title">${data.nome} ${data.cognome}</p>
            </div>
            <div class="card-content">
                <div class="content">
                    <p><strong>telefono: </strong>${data.tel}</p>
                    <p><strong>email: </strong>${data.email}</p>
                </div>
            </div>   
        </article>
        
    `;
    render(template, view);

}

const onPrint = (e) => {
    window.print();
}

const url = new URL(document.location.href);
const eventId = url.searchParams.get('eventId');
const bookingId = url.searchParams.get('bookingId');
const store = new EventStore();
store.find(eventId)
    .then(json => {
        console.log(json);
        renderEvent(json);
        return store.findBooking(eventId,bookingId);
    })
    .then(json => {
        renderPerson(json);
    });