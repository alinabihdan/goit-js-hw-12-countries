// imports
import './sass/main.scss';
import debounce from 'lodash.debounce';
import fetchCountries from './js/fetchCountries.js';
import contriesListTpl from './templates/countriesList.hbs';
import countryCardTpl from './templates/oneCountryInfo.hbs';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { defaults, info, success, error } from '@pnotify/core';
defaults.mouseReset = false;
defaults.delay = 3000;

// elements
const refs = {
  input: document.querySelector('#input'),
  countriesContainer: document.querySelector('#countriesContainer'),
  countryInfo: document.querySelector('#countryInfo'),
};

// добавляем событие
refs.input.addEventListener('input', debounce(onSearch, 500));

function onSearch(e) {
  if (!e.target.value) {
    return;
  }

  const searchQuery = e.target.value.trim();

  console.log(searchQuery);

  fetchCountries(searchQuery).then(renderCountries).catch(console.error);
}

// разметка
function renderCountries(countries) {
  refs.countriesContainer.innerHTML = '';
  refs.countryInfo.innerHTML = '';

  if (countries.status === 404) {
    error({
      title: 'Oh no! Not found!',
      text: 'Try again.',
    });
    return;
  } else if (countries.length > 10) {
    error({
      title: 'Too many matches found!',
      text: 'Please enter a more specific query!',
    });
    return;
  } else if (countries.length > 1 && countries.length <= 10) {
    const markup = contriesListTpl(countries);
    refs.countriesContainer.innerHTML = markup;

    info({
      title: 'Too many results.',
      text: 'Please enter a more specific query!',
    });
    return;
  } else if ((countries.length = 1)) {
    const markup = countryCardTpl(countries);
    refs.countryInfo.innerHTML = markup;

    success({
      title: 'Success!',
      text: 'That thing that you were trying to do worked.',
    });
    return;
  }
}
