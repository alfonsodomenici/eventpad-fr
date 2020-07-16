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
            <div class="box">
                <div class="level">
                    <div class="level-left">
                        <div class="container">
                            <p class="title is-3">${dFull(evt.quando)}</p>
                            <p class="subtitle">${evt.luogo}</p>
                        </div>
                    </div>
                    <nav class="level-right">
                        <div class="buttons">
                            <button @click=${e => onVisualizza(e,evt.quando)} class="button is-primary">Visualizza</button>
                        </div>
                    </nav>
                </div>
            </div>
        </li>
    `;
}

const onVisualizza = (e, data) => {
    window.location.href = `events.html?data=${data}`;
}

const store = new EventStore();
store.all()
    .then(json => renderEvents(json));
    