// ==UserScript==
// @name         Entradas Barcelona
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Hicmou
// @match        https://tickets.fcbarcelona.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    function getElementsAsync() {
        return new Promise((resolve, reject) => {
            let elements = document.querySelectorAll("li[ng-mouseover][ng-repeat]");
            let greyElements = document.querySelectorAll(".bg-light.venue-navigation-slot--disabled.ng-scope");

            if (elements.length > 0) {
                resolve(elements);
            } else if (greyElements.length > 0) {
                location.reload(); // Reload the page if greyElements are present but elements are not
                setTimeout(() => {
                    getElementsAsync().then(resolve).catch(reject); // Execute the same function after reload
                }, 1000);
            } else {
                const intervalId = setInterval(() => {
                    elements = document.querySelectorAll("li[ng-mouseover][ng-repeat]");
                    greyElements = document.querySelectorAll(".bg-light.venue-navigation-slot--disabled.ng-scope");

                    if (elements.length > 0) {
                        clearInterval(intervalId);
                        resolve(elements);
                    } else if (greyElements.length > 0) {
                        location.reload(); // Reload the page if greyElements are present but elements are not
                        clearInterval(intervalId);
                        setTimeout(() => {
                            getElementsAsync().then(resolve).catch(reject); // Execute the same function after reload
                        }, 1000);
                    }
                }, 100);
            }
        });
    }


    async function main() {
        const elements = await getElementsAsync();
        console.log(elements)
        const arrayOfElements = Array.from(elements)
        const newElements = arrayOfElements.map(function (element) {
            return element.querySelector("span.zoneInfo.price.pl-1.ng-binding");
        });

        console.log(newElements)
        newElements.sort((a, b) => {
            const priceA = Number(a.textContent.split(" ")[0]);
            const priceB = Number(b.textContent.split(" ")[0]);
            return priceA - priceB;
        })
        newElements.forEach(element => console.log(element.textContent))
        newElements[0].click()
        const next = document.querySelector("#box_plano_ div.cart-trigger__buttons.d-none.d-lg-block.mt-auto > a");
        next.click();

    }

    main();
})();