import { moveInstrumentation } from '../../scripts/scripts.js';
import { loadCSS } from '../../scripts/aem.js';

const hideCookieConsent = () => {
    const selectors = ['.cookiepolicy', '.cookiepolicy-container', '.cookiepolicy-wrapper'];
    selectors.forEach(s => {
        const el = document.querySelector(s);
        if (el) {
            el.classList.add('hide');
            el.style.display = 'none';
        }
    });
}

const setCookieData = (_e, accepted = true) => {
    //set for 180 days (localStorage persists until cleared or manually removed)
    localStorage.setItem('cookieConsent', accepted.toString());
    hideCookieConsent();
};

export class CookiePolicy {
    cookieBlock = null;
    constructor(elem) {
        this.cookieBlock = elem;
    }
    constructMarkup = () => {
        const codeBase = window.hlx?.codeBasePath || '';
        loadCSS(`${codeBase}/blocks/cookiepolicy/cookiepolicy.css`);

        const elem = this.cookieBlock;
        const blockElem = elem.classList.contains('block') ? elem : elem.querySelector('.block');
        blockElem.classList.add('container', 'cookiepolicy');
        
        // Force display because fragments/sections may be hidden by default
        elem.style.display = 'block';
        blockElem.style.display = 'block';

        const cells = Array.from(blockElem.querySelectorAll(':scope > div > div'));
        const cookieWrapper = document.createElement('div');
        cookieWrapper.classList.add('cookie-wrapper');
        
        if (localStorage.getItem('cookieConsent') !== null) {
            elem.style.display = 'none';
            blockElem.classList.add('hide');
        }

        const descriptionField = cells[0];
        if (descriptionField) {
            const descriptionDiv = document.createElement('div');
            descriptionDiv.classList.add('cookie-description');
            moveInstrumentation(descriptionField, descriptionDiv);
            descriptionDiv.innerHTML = descriptionField?.innerHTML;
            cookieWrapper.appendChild(descriptionDiv);
        }

        const declineField = cells[1];
        const acceptField = cells[2]
        if (declineField && acceptField) {
            const buttonWrapper = document.createElement('div');
            buttonWrapper.classList.add('cookie-button-wrapper');

            const declineButton = document.createElement('button');
            declineButton.classList.add('decline-button');
            moveInstrumentation(declineField, declineButton);
            declineButton.innerHTML = declineField?.textContent || '';
            declineButton.addEventListener('click', (e) => setCookieData(e, false));

            const acceptButton = document.createElement('button');
            acceptButton.classList.add('accept-button');
            moveInstrumentation(acceptField, acceptButton);
            acceptButton.innerHTML = acceptField?.textContent || '';
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

export default function decorate(block) {
    const cp = new CookiePolicy(block);
    cp.constructMarkup();
}
