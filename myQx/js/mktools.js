// ==UserScript==
// @name         mikutools
// @namespace    mikutools-pq
// @match        http*://tools.miku.ac/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

'use strict';

(() => {
    let dom = document.querySelector('#__nuxt');
    let vue = dom && dom.__vue__;
    if (!vue) {
        console.warn('qr vue is not detected.');
        return;
    }

    /* request success */
    vue.followedSuccess = true;
    const $state = vue.$store.app.store.state
    $state.vip = true
})();

