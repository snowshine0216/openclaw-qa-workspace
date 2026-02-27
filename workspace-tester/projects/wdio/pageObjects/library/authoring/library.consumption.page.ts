import { $ } from '@wdio/globals'

import { DossierInfo } from './utils/model.js';

import LibraryPage from './library.page.js';
import BasePage from '../../base/BasePage.js';

const OPEN_DODOSSIER_TIMEOUT = 5*60*1000;

class LibraryConsumptionPage extends BasePage {
    private get loadingIcon () {
        return this.$('.mstrd-LoadingIcon-content');
    }

    public get getVIDoc() {
        return this.$('.mstrmojo-VIDocument');
    }

}

export default new LibraryConsumptionPage();