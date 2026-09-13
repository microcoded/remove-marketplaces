// ==UserScript==
// @name         Remove Marketplaces
// @author       microcoded (https://github.com/microcoded) & Gemini 3.1 Pro
// @version      1.2
// @description  Automatically hides marketplace items on various Australian websites
// @match        *://*.jbhifi.com.au/*
// @match        *://*.bunnings.com.au/*
// @match        *://*.kogan.com/*
// @match        *://*.dicksmith.com.au/*
// @match        *://*.woolworths.com.au/*
// @match        *://*.kmart.com.au/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const rules = [
        { domains: ['jbhifi.com.au'], param: 'excludeMarketplace', value: 'true' },
        { domains: ['bunnings.com.au'], param: 'productranges', value: '!Marketplace' },
        { domains: ['kogan.com'], param: 'deals_from', value: 'kogan' },
        { domains: ['dicksmith.com.au'], param: 'deals_from', value: 'dicksmith' },
        { domains: ['woolworths.com.au'], param: 'isHideEverydayMarketProducts', value: 'true' },
        { domains: ['kmart.com.au'], param: 'f.Shops', value: ['Kmart', 'Target'] } // Kmart needs the same param twice, so we use an array
    ];

    const url = new URL(window.location.href);
    
    const activeRule = rules.find(rule => 
        rule.domains.some(domain => url.hostname.includes(domain))
    );

    if (activeRule) {
        const isHomepage = url.pathname === '/' || url.pathname === '';
        const isCheckout = /\/(cart|checkout)/i.test(url.pathname);
        
        if (!isHomepage && !isCheckout) {
            let needsUpdate = false;
            if (Array.isArray(activeRule.value)) {
                // Handle multiple values like Kmart (f.Shops=Kmart&f.Shops=Target)
                const currentValues = url.searchParams.getAll(activeRule.param).sort().join(',');
                const desiredValues = activeRule.value.slice().sort().join(',');

                if (currentValues !== desiredValues) {
                    url.searchParams.delete(activeRule.param);
                    activeRule.value.forEach(val => url.searchParams.append(activeRule.param, val));
                    needsUpdate = true;
                }
            } else {
                // Handle single values like JB Hi-Fi
                if (url.searchParams.get(activeRule.param) !== activeRule.value) {
                    url.searchParams.set(activeRule.param, activeRule.value);
                    needsUpdate = true;
                }
            }
            if (needsUpdate) window.location.replace(url.toString());
        }
    }
})();
