import { isTokenValid } from "./jwt.js";
import Menu from './Menu.js';
import EventStore from './EventStore.js';
import { html, render } from './lib/lit-html.js';
import { dFull } from './fmt.js';
import qrcode from './lib/qrcode-generator-es6.js';

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
                <p><strong>Ore </strong>  ${evt.ora}</p>
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
            ${renderQRCode(data.code)}
            <button @click=${e => onPrint(e)} class="button is-primary">Stampa</button>
            <button @click=${e => onAnnulla(e)} class="button is-danger" title = "Annulla la prenotazione">Annulla</button>
        `;
    }else{
        template = html`
            <button @click=${e => onAnnulla(e)} class="button is-danger" title = "Annulla la prenotazione">Annulla</button>
        `;
    }
    render(template, view);

}

const renderQRCode = (code) => {
    console.log('render qrcode');
    const el = document.querySelector('div.qrcode');
    const qr = new qrcode(0, 'H');
    qr.addData(`${document.location.href}&code=${code}`);
    qr.make();
    el.innerHTML = qr.createSvgTag({});
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

const renderInfo = _ => {
    const info = document.querySelector('div.info');
    const template = html`
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox" checked>
                    <p class="is-3 is-size-4 has-text-weight-medium">Informativa sul trattamento dei dati personali</p>
                    <p>Gentile interessato desideriamo informarLa che il “Regolamento Europeo 2016/679 relativo alla protezione delle persone fisiche con riguardo al Trattamento dei Dati Personali, nonché alla libera circolazione di tali dati” prevede la tutela delle persone e di altri soggetti rispetto al trattamento dei dati personali. CINEMAMBIENTE pertanto, in qualità di “Titolare” del trattamento, ai sensi dell’articolo 13 del GDPR, contattabile all’indirizzo XXXXXXXXXx, numero di telefono XXXXXXXXXX,  indirizzo e-mail XXXXXXXXxx , Le fornisce le seguenti informazioni:</p>
                    <p>CINEMAMABIENTE tratterà i dati personali, sensibili o sanitari che saranno inseriti nel form direttamente dall’interessato. Il trattamento dei suoi dati ha come base giuridica quella di prenotare la sua partecipazione ad uno degli eventi previsti nell’ambito della manifestazione CINEMAMBIENTEVALCHIUSELLA in conseguenza dell’applicazione delle norme anticontagio COVID (DPCM 14/07/2020), che prevedono il mantenimento dei dati in archivio per 14 giorni dall’evento e la comunicazione di tali dati eventualmente, su richiesta, alle autorità sanitarie (ASL). I dati raccolti non saranno trasferiti al di fuori dell’Unione europea. L’interessato ha diritto ha richiedere la modifica dei dati semplicemente contattando il numero di telefono o la mail del titolare del trattamento. Se i dati indicati con asterisco non verranno conferiti, la prenotazione non potrà essere accettata.</p>
                </label>
            </div>
        </div>

        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox" checked>
                    <p class="is-3 is-size-4 has-text-weight-medium">Dichiarazione dell’interessato</p>
                    <p>DICHIARO DI ESSERE A CONOSCENZA CHE SE IL GIORNO DELL’EVENTO AVRO’ LA FEBBRE OLTRE 37.5 °C, OPPURE ALTRI SINTOMI INFLUENZALI, NON PARTECIPERO’ ALL’EVENTO; INOLTRE, DICHIARO CHE PARTECIPERO’  ALL’EVENTO SOLO SE NEI PRECEDENTI 14 GIORNI NON AVRO’ AVUTO CONTATTI CON SOGGETTI POSITIVI AL COVID-19 E NON SARO’ STATO NEI PAESI A RISCHIO (RIF. SITO MINISTERO DEGLI AFFARI ESTERI – www.viaggiaresicuri.it).</p>
                    <p>IN CASO DI QUALSIASI IMPEDIMENTO A PARTECIPARE, CANCELLERO’ LA PRENOTAZIONE CHIAMANDO IL N. xxxxxxxxxxxxX OPPURE VIA MAIL ALL’INDIRIZZO : xxxxxxxxxxxxxxxxxxx.</p>
                </label>
            </div>
        </div>    
    `;
    render(template,info)
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
    document.querySelectorAll('button')
        .forEach(b => b.classList.toggle('is-hidden'));
    window.print();
    document.querySelectorAll('button')
        .forEach(b => b.classList.toggle('is-hidden'));
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
        renderInfo();
    });