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

const renderPersons = (data) => {
    counter = 0;
    const view = document.querySelector('div.prenotazioni');
    const template = html`
        <table class="table is-fullwidth">
            <thead>
                <tr>
                    <th></th>
                    <th>Nome</th>
                    <th>Cognome</th>
                    <th><abbr title="Telefono">Tel</abbr></th>
                    <th>Email</th>
                    <th><abbr title="Confermata">Conf</abbr></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${data.map(p => renderPerson(p))}
            </tbody>
        </table>
        
    `;
    render(template, view);

}
const renderPerson = (data) => {
    counter++;
    return html`
        <tr>
            <td>${counter}</td>
            <td>${data.nome}</td>
            <td>${data.cognome}</td>
            <td>${data.tel}</td>
            <td>${data.email}</td>
            <td>${data.confermato ? html`<input type="checkbox" checked disabled style="width: 20px; height: 20px;">` : html`<input type="checkbox" disabled style="width: 20px; height: 20px;">`}</td>
            <td><a @click=${e => onElimina(e,data.id)} href="#">elimina</a></td>
        </tr>
    `;
}

const onElimina = (e,id) => {
    store.deleteBooking(eventId,id)
    .then(_ => {
        return store.findBookings(eventId)
    })
    .then(json => {
        renderPersons(json);
    });
}

const onPrint = (e) => {
    window.print();
}

let counter = 0;
const url = new URL(document.location.href);
const eventId = url.searchParams.get('eventId');
const store = new EventStore();
store.find(eventId)
    .then(json => {
        renderEvent(json);
        return store.findBookings(eventId);
    })
    .then(json => {
        renderPersons(json);
    });