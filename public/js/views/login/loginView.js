import './loginView.tmpl.js';

/**
 * View of login page
 */
export default class LoginView {
    /**
     * View constructor
     * @param {object} eventBus - local event bus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.root = document.getElementById('application');
        this.eventBus.subscribe('inputError', this.displayError);
        this.render = this.render.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Render view method
     */
    render() {
        this.root.innerHTML = window.fest['js/views/login/loginView.tmpl']();
        this.addEventListeners();
    };

    addEventListeners() {
        const submitButton = document.getElementById('submit_button');
        submitButton.addEventListener('click', this.handleSubmit);
    }

    displayError(display) {
        const errorLabel = document.getElementById('inputError');
        display ? errorLabel.classList.remove('hidden') : errorLabel.classList.add('hidden');
    }

    handleSubmit(event) {
        event.preventDefault();
        this.eventBus.call('submit', this.getUserData());
    }

    /**
     * Get user input data
     * @return {{password: *, login: *}}
     */
    getUserData() {
        return {
            nickname: document.getElementById('inputLogin').value,
            password: document.getElementById('inputPassword').value,
        };
    }
}
