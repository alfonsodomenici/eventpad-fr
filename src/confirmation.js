import { isTokenValid } from "./jwt.js";
import Menu from './Menu.js';
import EventStore from './EventStore.js';
import { html, render } from './lib/lit-html.js';
import { dFull } from './fmt.js';
const updateBreadcrumb = ({ id, quando }) => {
    const bc = document.querySelector('nav.breadcrumb');
    const template = html`
        <ul>
            <li><a href="index.html">Calendario eventi</a></li>
            <li><a href="events.html?data=${quando}">${dFull(quando)}</a></li>
            <li><a href="booking.html?eventId=${id}">prenotazione</a></li>
            <li class="is-active"> 
                <a href="${window.location.href}" aria-current="page">conferma</a>
            </li>
        </ul>
    `;
    render(template, bc);
}

const renderEvent = (evt) => {
    updateBreadcrumb(evt)
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
                    <label class="checkbox" disabled>
                        ${data.confermato ? html`<input type="checkbox" checked>` : html`<input type="checkbox">`}
                        Prenotazione confermata
                    </label>
                </div>
            </div>   
    `;
    render(template, view);

}

const renderDynamic = (data) => {
    const view = document.querySelector('div.dynamic');
    let template = html``;
    if (!data.confermato) {
        template = html`
            <button @click=${e => onConferma(e)} class="button is-primary">Conferma</button>
            <button @click=${e => onAnnulla(e)} class="button is-danger" alt = "Annulla la prenotazione">Annulla</button>
        `;
    }else if (code === null){
        template = html`
            <button @click=${e => onPrint(e)} class="button is-primary">Stampa</button>
            <button @click=${e => onAnnulla(e)} class="button is-danger" title = "Annulla la prenotazione">Annulla</button>
        `;
    }
    render(template, view);

}

const renderAnnullata = _ => {
    const root = document.querySelector('section.view');
    const template = html`
        <div class="notification is-success is-light">
            <p class = 'title'> La prenotazione è stata annullata. </p>
        </div>
    `;
    render(template, root);
}

const renderError = msg => {
    const not = document.querySelector('div.notifiche');
    const template = html`
        <div class="notification is-danger is-light">
            <button @click=${e => onCloseError(e)} class="delete"></button>
            <p class = 'title'> Errore </p>
            <p>${msg}</p>
            <p>Riprova</p>
        </div>
    `;
    render(template, not);
}

const onCloseError = e => {
    console.log("close");
    const not = document.querySelector('div.notifiche');
    render(html``, not);
}

const onConferma = (e) => {
    store.confirmBooking(eventId, bookingId)
        .then(data => {
            renderPerson(data);
            renderDynamic(data);
        })
        .catch(ex => {
            renderError(ex);
        })
}

const onAnnulla = (e) => {
    try {
        store.deleteBooking(eventId, bookingId);
        renderAnnullata();
    } catch (ex) {
        renderError('Impossibile annullare la prenotazione');
    }
}

const onPrint = (e) => {
    window.print();
}

const url = new URL(document.location.href);
const eventId = url.searchParams.get('eventId');
const bookingId = url.searchParams.get('bookingId');
const code = url.searchParams.get('code');
const store = new EventStore();
store.find(eventId)
    .then(json => {
        console.log(json);
        renderEvent(json);
        return store.findBooking(eventId, bookingId);
    })
    .then(json => {
        renderPerson(json);
        renderDynamic(json);
    });