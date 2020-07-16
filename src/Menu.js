import { isTokenValid, removeToken } from './jwt.js';
import { html, render } from './lib/lit-html.js';

export default class Menu extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        render(this.createView(), this);
        // Get all "navbar-burger" elements
        const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

        // Check if there are any navbar burgers
        if ($navbarBurgers.length > 0) {

            // Add a click event on each of them
            $navbarBurgers.forEach(el => {
                el.addEventListener('click', () => {

                    // Get the target from the "data-target" attribute
                    const target = el.dataset.target;
                    const $target = document.getElementById(target);

                    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                    el.classList.toggle('is-active');
                    $target.classList.toggle('is-active');

                });
            });
        }
    }

    onLogout(e) {
        e.preventDefault();
        removeToken();
        document.location.href = 'index.html';
    }

    createView() {
        return html`
                <ul>
                    ${this.renderMenu()}
                </ul>
        `;
    }

    renderMenu() {
        return html`

            <nav class="navbar" role="navigation" aria-label="main navigation">
                <div class="navbar-brand">
                    <a class="navbar-item" href="https://cinemambiente.it/cinemambiente-in-valchiusella-2020/">
                        <img src="images/cinemambiente-header.png"  height="28">
                    </a>
            
                    <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>
          
            <div id="navbarBasicExample" class="navbar-menu">
                <div class="navbar-start">
                    <a class="navbar-item" href="index.html">
                    Home
                    </a>
                </div>
          
                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons">
                            ${isTokenValid() ? 
                                html`<a @click=${e => this.onLogout(e)} class="button is-light" href="#">Log out</a>`
                                 : 
                                html`<a class="button is-light" href="login.html">Log in</a>`
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
          </nav>
        `;
    }
}

customElements.define('pw-menu', Menu);