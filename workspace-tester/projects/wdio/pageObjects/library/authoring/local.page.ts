import { browser, $ } from '@wdio/globals'

class LocalPage {
    public get tomcatLogo () {
        return this.$('#tomcat-logo');
    }

    public open () {
        return browser.url(`http://localhost:8080/`)
    }
}

export default new LocalPage();