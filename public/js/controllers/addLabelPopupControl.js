import AddLabelPopupModel from '../models/addLabelPopupModel.js';
import AddLabelPopupView from '../views/addLabelPopup/addLabelPopupView.js';
import CreateLabelPopupController from './createLabelPopupControl.js';
import EventBus from '../libs/eventBus.js';

import ControllerChainLink from '../libs/controllerChainLink.js';
import {ChainLinkSignals} from '../libs/controllerChainLink.js';


/**
 * Add label popup controller
 */
export default class AddLabelPopupController extends ControllerChainLink {
    /**
     * Controller constructor
     * @param {EventBus} parentEventBus - for communication with parent mvc
     */
    constructor(parentEventBus) {
        const chainLinkSignalsArray = Object.values(ChainLinkSignals);
        const actualSignals = [
            'getLabels',
            'gotLabels',

            'openCreateLabelPopup',
            'closedCreateLabelPopup',

            'openChangeLabelPopup',
            'closedChangeLabelPopup',
        ];

        const eventBus = new EventBus(actualSignals.concat(chainLinkSignalsArray));
        super(eventBus, parentEventBus);

        this.setCustomCloseFunction(() => {
            this.view.closeSelf();
            parentEventBus.call('closedAddLabelPopup');
        });


        this.view = new AddLabelPopupView(this.eventBus);
        this.model = new AddLabelPopupModel(this.eventBus);

        this.eventBus.subscribe('openCreateLabelPopup', (button) => {
            const childController = new CreateLabelPopupController(this.eventBus);
            this.setChildEventBus(childController.eventBus);
            childController.view.render(button.getBoundingClientRect());
        });

        this.eventBus.subscribe('closedCreateLabelPopup', () => {
            this.view.render();
        });
    }
}
