import _ from 'lodash';
import { error, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import '@pnotify/core/dist/BrightTheme.css';

import './styles.css';
import fetchCountries from './fetchCountries';

defaultModules.set(PNotifyMobile, {});

const refs = {
    input: document.querySelector('.country-query'),
    container: document.querySelector('.countries-info-wrapper'),
}

const debouncedOnInput = _.debounce(onInput, 500)
refs.input.addEventListener('input', debouncedOnInput);

function onInput(event) {
    const query = event.target.value;

    if (!query) {
        return;
    }
    fetchCountries(query)
        .then(countries => {
            let result = null;

            if (countries.length > 10) {
                error({
                    text: 'Too many matches found. Enter a more specific query!',
                    delay: 1500,
                    hide: true
                })
            }
            if (countries.length >= 2 && countries.length <= 10) {
                result = `
                <ul class="countires-list">
                ${countries
                    .map(country => `<li>${country.name}</li>`)
                    .join('')}
                </ul>
                ` 
            }
            if (countries.length === 1) {
                const [country] = countries;
                result = `
                <div class="country-wrapper">
                <h1>${country.name}</h1>
                <img width=200 src=${country.flag}>
                <h3>Capital: <span>${country.capital}</span></h3>
                <h3>Population: <span>${country.population}</span></h3>
                <h3>Languages:</h3>
                <ul>${country.languages.map(language => `<li>${language.name}</li>`).join('')}</ul>
                </div>
                `
            }

            refs.container.insertAdjacentHTML(
            'afterbegin', result === null ? `<h1>No matches found!</h1>` : result);
        })
}