// ==UserScript==
// @name         Wayfarer Shitty Showcase Without Onboarding
// @version      0.1
// @description  Renders something akin to a showcase
// @author       NvlblNm
// @match        https://wayfarer.nianticlabs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nianticlabs.com
// @downloadURL  https://github.com/NvlblNm/wayfarer-onboarding-showcase/raw/main/onboarding-showcase.user.js
// @updateURL    https://github.com/NvlblNm/wayfarer-onboarding-showcase/raw/main/onboarding-showcase.user.js
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    const createEl = (opts) => {
        const el = document.createElement(opts.type);
        if (opts.classes) {
            el.classList = opts.classes;
        }
        if (opts.text) {
            el.innerText = opts.text;
        }
        if (opts.parent) {
            opts.parent.append(el);
        }
        return el;
    }
    const replaceOnboarding = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/v1/vault/home', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                const showcases = JSON.parse(xhr.response).result.showcase;
                const showcaseWrapper = createEl({
                    type: 'div',
                    classes: 'mat-dialog-content absolute inset-x-0 bottom-4 top-header m-0 p-0 overflow-hidden flex ng-star-inserted',
                });
                const showcaseContainer = createEl({
                    type: 'div',
                    classes: 'onboarding-content-container p-4 overflow-y-auto w-full h-full',
                    parent: showcaseWrapper,
                });
                const flexCol = createEl({
                    type: 'div',
                    classes: 'flex flex-col h-full ng-star-inserted',
                    parent: showcaseContainer,
                });
                const flexRow = createEl({
                    type: 'div',
                    classes: 'flex flex-row justify-center h-full',
                    parent: flexCol,
                });
                const flexCol2 = createEl({
                    type: 'div',
                    classes: 'flex flex-col self-start space-y-2 w-full mb-2',
                    parent: flexRow,
                });
                createEl({
                    type: 'h2',
                    text: 'Welcome to Shitty Showcase!',
                    parent: flexCol2,
                });
                const linky = createEl({
                    type: 'a',
                    text: 'idgaf, take me to my noms!',
                    parent: flexCol2,
                });
                linky.href = '/new/nominations';

                showcases.forEach(showcase => {
                    const showcaseEl = createEl({
                        type: 'div',
                        classes: 'flex flex-col self-start space-y-2 w-full mb-2',
                        parent: flexCol2,
                    });
                    createEl({
                        type: 'h4',
                        text: showcase.title,
                        parent: showcaseEl,
                    });
                    createEl({
                        type: 'p',
                        text: showcase.description,
                        parent: showcaseEl,
                    });
                    createEl({
                        type: 'p',
                        text: showcase.address,
                        parent: showcaseEl,
                    });
                    createEl({
                        type: 'p',
                        text: showcase.discoverer ?
                            'Submitted by ' + showcase.discoverer + ' in ' + showcase.discovererGame :
                            'Submitter chose to remain anonymous :\'(',
                        parent: showcaseEl,
                    });
                    if (showcase.categoryName || showcase.criteriaTitle || showcase.criteriaDescription) {
                        createEl({
                            type: 'p',
                            text: showcase.categoryName + ' - ' + showcase.criteriaTitle + ' - ' + showcase.criteriaDescription,
                            parent: showcaseEl,
                        });
                    }
                    const showcaseImg = createEl({
                        type: 'img',
                        parent: showcaseEl,
                    });
                    showcaseImg.src = showcase.imageUrl;
                });
                const onboarding = document.getElementsByTagName('app-onboarding-content')[0];
                onboarding.replaceChildren(
                    onboarding.children[0],
                    showcaseWrapper,
                );
            }
        }
        xhr.send();
    }

    const init = () => {
        // We match a relatively loose path because otherwise the plugin doesn't init properly
        // but we only care about the onboarding page
        if (!window.location.pathname.endsWith('/onboarding')) {
            return;
        }
        // Wait for onboarding
        const waitForLoad = setInterval(() => {
            const onboarding = document.getElementsByTagName('wf-header');
            if (onboarding && onboarding[0]) {
                clearInterval(waitForLoad);
                replaceOnboarding();
            }
        }, 100);
    };

    init();

    // When signing in, init runs too early, re-run it when location changes
    navigation.addEventListener('navigatesuccess', init)
})();
