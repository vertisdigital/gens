import { moveInstrumentation } from '../../scripts/scripts.js';
import { getCookie } from '../../shared-components/Utility.js';

const hideCookieConsent = () => {
    document.querySelector('.cookiepolicy')?.classList?.add('hide');
}

const setCookieData = (_e, accepted = true) => {
    //set for 180 days
    document.cookie = `cookieConsent=${accepted};path=/;max-age=15552000`
    hideCookieConsent();
};
export default class CookiePolicy {
    cookieBlock = null;
    constructor(elem) {
        this.cookieBlock = elem;
    }
    constructMarkup = () => {
        const elem = this.cookieBlock;
        const blockElem = elem.querySelector('.block');
        blockElem.classList.add('container');
        const childElements = blockElem.children;
        const cookieWrapper = document.createElement('div');
        cookieWrapper.classList.add('cookie-wrapper');
        if(getCookie('cookieConsent')) {
            blockElem.classList.add('hide');
        }
        const descriptionField = childElements[0];
        if(descriptionField) {
            const descriptionDiv = document.createElement('div');
            descriptionDiv.classList.add('cookie-description');
            moveInstrumentation(descriptionField, descriptionDiv);
            descriptionDiv.innerHTML = descriptionField?.innerHTML;
            cookieWrapper.appendChild(descriptionDiv);
        }

        const declineField = childElements[1];
        const acceptField = childElements[2]
        if(declineField && acceptField) {
            const buttonWrapper = document.createElement('div');
            buttonWrapper.classList.add('cookie-button-wrapper');

            const declineButton = document.createElement('button');
            declineButton.classList.add('decline-button');
            moveInstrumentation(declineField, declineButton);
            declineButton.innerHTML = declineField?.textContent ||'';
            declineButton.addEventListener('click', (e)=>setCookieData(e,false));

            const acceptButton = document.createElement('button');
            acceptButton.classList.add('accept-button');
            moveInstrumentation(acceptField, acceptButton);
            acceptButton.innerHTML = acceptField?.textContent ||'';
            acceptButton.addEventListener('click', setCookieData);

            buttonWrapper.appendChild(declineButton);
            buttonWrapper.appendChild(acceptButton);
            cookieWrapper.appendChild(buttonWrapper);
        }
        blockElem.innerHTML = '';
        blockElem.appendChild(cookieWrapper);
        document.body.appendChild(elem);
    }
}