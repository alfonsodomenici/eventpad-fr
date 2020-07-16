import {isTokenValid} from "./jwt.js";
import Menu from './Menu.js';
import EventStore from './EventStore.js';
import {html, render} from './lib/lit-html.js';
import {dFull} from './fmt.js';

const renderEvents = (data) => {
    const view = document.querySelector('.view');
    const template = html`
        <div class="list">
            <ul>
                ${data.map(evt => renderEvent(evt))}
            </ul>
        </div>
    `;
    render(template,view);
}

const renderEvent = (evt) => {
    return html`
        <li class="list-item">
            <div class="box mb-2">
                <div class="level">
                    <div class="level-left" style='width:80% !important;'>
                        <div class="container">
                            <p class="title is-3">${dFull(evt.quando)}</p>
                            <p class="subtitle">${evt.luogo}</p>
                            <p><strong>${evt.categoria}</strong></p>
                            <p class="subtitle">${evt.titolo}</p>
                            <p class='mb-4'>${evt.descrizione}</p>
                            <p class="subtitle has-text-success"><strong>Posti disponibili</strong> <small>${evt.posti - evt.prenotazioni} su ${evt.posti}</small></p>
                            ${renderAdmin(evt.id)}
                        </div>
                    </div>
                    <nav class="level-right">
                        <div class="buttons">
                            <button @click=${e => onPrenota(e,evt.id)} class="button is-primary">Prenota</button>
                        </div>
                    </nav>
                </div>
            </div>
        </li>
    `;
}

const renderAdmin = (eventId) => {
    return isTokenValid() ?
            html`
                <nav class="level is-mobile">
                    <div class="level-left">
                        <a  class="level-item " >visualizza prenotazioni </a>
                        <a @click=${e => onEliminaPrenotazioni(e,eventId)} class="level-item" >elimina prenotazioni</a>
                    </div>
                </nav>
            ` 
        :
            html``;
}

const onEliminaPrenotazioni = (e,eventId) => {
    e.preventDefault();
    store.deleteBookings(eventId)
    .then(_ => {
        return store.byDate(data);
    })
    .then(json => renderEvents(json));
}

const onPrenota = (e, eventId) => {
    window.location.href = `booking.html?eventId=${eventId}`;
}

const url = new URL(document.location.href);
const data = url.searchParams.get('data');
const store = new EventStore();
store.byDate(data)
    .then(json => renderEvents(json));
    