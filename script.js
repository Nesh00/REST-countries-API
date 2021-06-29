'use strict';

const themeBtn = document.querySelector('.theme-container');
const themeImg = document.querySelector('.theme-img');
const themeText = document.querySelector('.text-theme-color');
const countriesContainer = document.querySelector('.countries');
const region = document.querySelector('.select-region');
const searchBar = document.querySelector('.search-bar');

const countriesAllAPI = 'https://restcountries.eu/rest/v2/all';
const countriesByRegionAPI = 'https://restcountries.eu/rest/v2/region/';
const countriesByNameAPI = 'https://restcountries.eu/rest/v2/name/';

// Color theme
const changeThemeBtn = function () {
  if (document.documentElement.className === 'theme-light') {
    themeImg.name = 'sunny-sharp';
    themeText.textContent = 'Light Mode';
  } else {
    themeImg.name = 'moon';
    themeText.textContent = 'Dark Mode';
  }
};

const setTheme = function (themeName) {
  localStorage.setItem('theme', themeName);
  document.documentElement.className = themeName;
};

const toggleTheme = function () {
  localStorage.getItem('theme') === 'theme-dark'
    ? setTheme('theme-light')
    : setTheme('theme-dark');

  changeThemeBtn();
};

themeBtn.addEventListener('click', toggleTheme);

// HTML Markup
const renderCountry = function (data) {
  const html = `
        <a href="#" class="country-card">
            <div class="country-flag"><img src="${
              data.flag
            }" alt="Country Flag" /></div>
            <div class="country-details">
                <h3 class="country-name">${data.name}</h3>
                <h4>Population: <span>${new Intl.NumberFormat(
                  navigator.language
                ).format(data.population)}</span></h4>
                <h4>Region: <span>${data.region}</span></h4>
                <h4>Capital: <span>${data.capital}</span></h4>
            </div>
        </a>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};

// API
const getCountries = async function (url, regionOrName = '') {
  try {
    const response = await fetch(`${url}${regionOrName}`);

    if (!response.ok) throw new Error(console.error('WRONG INPUT'));
    const data = await response.json();

    countriesContainer.textContent = '';
    data.forEach(country => {
      renderCountry(country);
    });
  } catch (err) {
    console.log(`${err.message}`);
  }
};

// Select-options EVENT
region.addEventListener('change', function (event) {
  event.target.value === 'All'
    ? getCountries(countriesAllAPI)
    : getCountries(countriesByRegionAPI, event.target.value);
});

// Search-Bar EVENT
searchBar.addEventListener('keyup', function (event) {
  event.target.value.length === 0
    ? getCountries(countriesAllAPI)
    : getCountries(countriesByNameAPI, event.target.value);
});

// INIT
(function onloadDisplay() {
  localStorage.getItem('theme') === 'theme-dark'
    ? setTheme('theme-dark')
    : setTheme('theme-light');

  changeThemeBtn();
  getCountries(countriesAllAPI);
})();
