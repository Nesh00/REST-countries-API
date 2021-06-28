'use strict';

const themeBtn = document.querySelector('.theme-container');
const themeImg = document.querySelector('.theme-img');
const themeText = document.querySelector('.text-theme-color');
const countriesContainer = document.querySelector('.countries');
const region = document.querySelector('.select-region');

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
  if (localStorage.getItem('theme') === 'theme-dark') {
    setTheme('theme-light');
  } else {
    setTheme('theme-dark');
  }
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

// API's
const getAllCountries = async function () {
  try {
    const response = await fetch('https://restcountries.eu/rest/v2/all');

    if (!response.ok) return;
    const data = await response.json();

    countriesContainer.textContent = '';
    data.forEach(country => {
      renderCountry(country);
    });
  } catch {
    console.log('error');
  }
};

const getCountryByRegion = async function (countryRegion) {
  try {
    const response = await fetch(
      `https://restcountries.eu/rest/v2/region/${countryRegion}`
    );

    if (!response.ok) return;
    const dataCountry = await response.json();

    countriesContainer.textContent = '';
    dataCountry.forEach(country => {
      renderCountry(country);
    });
  } catch {
    throw new Error(console.error('WRONG INPUT'));
  }
};

// Select Options EVENT
region.addEventListener('change', function (event) {
  if (event.target.value === 'All') {
    getAllCountries();
  } else {
    getCountryByRegion(event.target.value);
  }
});

// Init
(function onloadDisplay() {
  if (localStorage.getItem('theme') === 'theme-dark') {
    setTheme('theme-dark');
  } else {
    setTheme('theme-light');
  }
  changeThemeBtn();
  getAllCountries();
})();
