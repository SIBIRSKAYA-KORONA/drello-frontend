import './profileView.tmpl.js';

/**
 * View of login page
 */
export default class ProfileView {
    /**
     * View constructor
     * @param eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.root = document.getElementById('application');
        this.inputtedData = {};

        this.render = this.render.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleUserInputPasswordRepeat = this.handleUserInputPasswordRepeat.bind(this);

        eventBus.subscribe('gotData', this.render);
        this.eventBus.call('getData');
    }

    /**
     * Render view method
     * @param {object} data user data to render
     */
    render(data) {
        console.log("render profile");
        this.root.innerHTML = window.fest['js/views/profile/profileView.tmpl'](data);
        this.addEventListeners();
    }

    addEventListeners() {
        const submitButtons = [
            document.getElementById('submitAbout'),
            document.getElementById('submitPasswords'),
            document.getElementById('submitEmail'),
            document.getElementById('submitImg'),
        ];
        submitButtons.forEach((button) => {
            button.addEventListener('click', this.handleSubmit);
        });

        const inputs = [
            document.getElementById('inputName'),
            document.getElementById('inputSurname'),
            document.getElementById('inputEmail'),
            document.getElementById('inputOldPassword'),
            document.getElementById('inputPassword'),
        ];
        inputs.forEach((input) => {
            input.addEventListener('input', this.handleUserInput);
            input.addEventListener('blur', this.handleUserInput);

            const errorInputSignal = input.id + 'Error';
            const errorInputHandler = this[errorInputSignal + 'Handler'];
            this.eventBus.subscribe(errorInputSignal, errorInputHandler);
        });

        const inputPasswordRepeat = document.getElementById('inputPasswordRepeat');
        inputPasswordRepeat.addEventListener('input', this.handleUserInputPasswordRepeat);
        inputPasswordRepeat.addEventListener('blur', this.handleUserInputPasswordRepeat);
        this.eventBus.subscribe('inputPasswordRepeatError', this.inputPasswordRepeatErrorHandler);
    }

    handleUserInput(e) {
        const inputField = e.target;
        this.inputtedData[inputField.id] = inputField.value;

        const eventBusValidateSignal = inputField.id;
        const dataToValidate = this.inputtedData[inputField.id];
        this.eventBus.call(eventBusValidateSignal, dataToValidate);
    }

    handleUserInputPasswordRepeat(e) {
        const inputPasswordRepeatField = e.target;
        this.inputtedData[inputPasswordRepeatField.id] = inputPasswordRepeatField.value;
        console.log(inputPasswordRepeatField.id);

        const data = [this.inputtedData.inputPasswordRepeat, inputPasswordRepeatField.value];
        this.eventBus.call('inputPasswordRepeat', data);
    }

    inputNameErrorHandler(error) {
        const errorLabel = document.getElementById('inputNameError');
        error ? errorLabel.classList.remove('hidden') : errorLabel.classList.add('hidden');
    }

    inputSurnameErrorHandler(error) {
        const errorLabel = document.getElementById('inputSurnameError');
        error ? errorLabel.classList.remove('hidden') : errorLabel.classList.add('hidden');
    }

    inputNicknameErrorHandler(error) {
        const errorLabel = document.getElementById('inputNicknameError');
        error ? errorLabel.classList.remove('hidden') : errorLabel.classList.add('hidden');
    }

    inputPasswordErrorHandler(error) {
        const errorLabel = document.getElementById('inputPasswordError');
        error ? errorLabel.classList.remove('hidden') : errorLabel.classList.add('hidden');
    }

    inputPasswordRepeatErrorHandler(error) {
        const errorLabel = document.getElementById('inputPasswordRepeatError');
        error ? errorLabel.classList.remove('hidden') : errorLabel.classList.add('hidden');
    }

    handleSubmit(e) {
        console.log(this.inputtedData);
        e.preventDefault();
/*        let data = {};
        switch (e.target.id) {
            case 'submitAbout':
                console.log('submitAbout');
                data.newName = this.inputtedData.inputName;
                data.newSurname = this.inputtedData.inputSurname;
                break;
            case 'submitEmail':
                console.log('submitEmail');
                data.newEmail = this.inputtedData.inputEmail;
                break;
            case 'submitPasswords':
                data.oldPassword  = this.inputtedData.inputOldPassword;
                data.newPassword  = this.inputtedData.inputPassword;
                console.log('submitPasswords');
                break;
            case 'submitImg':
                console.log('submitImg');
                break;
        }*/
        const eventBusSubmitSignal = e.target.id;
        this.eventBus.call(eventBusSubmitSignal, this.inputtedData);
    }


    getUserInput() {
        return {
            name: document.getElementById('inputName').value,
            surname: document.getElementById('inputSurname').value,
            password: document.getElementById('inputPassword').value,
            passwordNew: document.getElementById('inputPassword').value,
            email: document.getElementById('inputPassword').value,
        };
    }
}
