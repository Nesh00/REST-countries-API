'use strict';

const themeBtn = document.querySelector('.theme-container');
const themeImg = document.querySelector('.theme-img');
const themeText = document.querySelector('.text-theme-color');
const mainContainer = document.querySelector('main');
const countriesContainer = document.querySelector('.countries');
const searchContainer = document.querySelector('.search-container');
const region = document.querySelector('.select-region');
const searchBar = document.querySelector('.search-bar');
const clearSearchBtn = document.querySelector('.search-clear');

const allAPI_URL = 'https://restcountries.com/v2/all';
const byRegionAPI_URL = 'https://restcountries.com/v2/continent/';
const byNameAPI_URL = 'https://restcountries.com/v2/name/';

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

// Store theme
const setTheme = function (themeName) {
  localStorage.setItem('theme', themeName);
  document.documentElement.className = themeName;
};

// Use theme
const toggleTheme = function () {
  localStorage.getItem('theme') === 'theme-dark'
    ? setTheme('theme-light')
    : setTheme('theme-dark');

  changeThemeBtn();
};

// Theme Button EVENT
themeBtn.addEventListener('click', toggleTheme);

// Format Numbers
const convertNumbers = population => {
  return new Intl.NumberFormat(navigator.language).format(population);
};

// Main Page Markup
const renderCountry = function (country) {
  const html = `
        <a href="#${country.name}" class="country-card">
        <img class="country-flag" src="${country.flag}" alt="Country Flag" />
            <div class="country-details">
                <h3 class="country-name">${country.name}</h3>
                <h4>Population: <span>${convertNumbers(
                  country.population
                )}</span></h4>
                <h4>Region: <span>${country.region}</span></h4>
                <h4>Capital: <span>${country.capital}</span></h4>
            </div>
        </a>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};

// API
const getCountries = async function (url, regionOrName = '') {
  countriesContainer.textContent = '';
  try {
    const response = await fetch(`${url}${regionOrName}`);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    data.forEach(country => {
      renderCountry(country);
    });
  } catch (err) {
    console.log(err);
  }
};

// Clear Input Button EVENT
clearSearchBtn.addEventListener('click', function () {
  searchBar.value = '';
  clearSearchBtn.classList.add('hidden');
  getCountries(allAPI_URL);
});

// Select-options EVENT
region.addEventListener('change', function (event) {
  event.target.value === 'All'
    ? getCountries(allAPI_URL)
    : getCountries(byRegionAPI_URL, event.target.value);
  searchBar.value = '';
  clearSearchBtn.classList.add('hidden');
});

// Search-Bar EVENT
searchBar.addEventListener('keyup', function (event) {
  event.target.value.length === 0
    ? getCountries(allAPI_URL) && clearSearchBtn.classList.add('hidden')
    : getCountries(byNameAPI_URL, event.target.value) &&
      clearSearchBtn.classList.remove('hidden');
  region.value = 'All';
});

// INIT
(function onloadDisplay() {
  localStorage.getItem('theme') === 'theme-dark'
    ? setTheme('theme-dark')
    : setTheme('theme-light');

  changeThemeBtn();
  getCountries(allAPI_URL);
})();

// Country MARKUP
const renderFullCountryDetails = function (country) {
  const html = `
        <section class="full-details--section">
              <a href="#" class="btn-return">
                <ion-icon name="return-down-back"></ion-icon>
                Back</a
              >

              <div class="full-details--container">
                <div class="full-details__box-1">
                  <img src="${country.flag}" alt="Country Flag" />
                </div>

                <div class="full-details__box-2">
                  <h2 class="full-details--name">${country.name}</h2>

                  <div class="details-container">
                    <div class="details-container__box-1">
                      <h4>Native Name:<span> ${country.nativeName}</span></h4>
                      <h4>Population:<span> ${convertNumbers(
                        country.population
                      )}</span></h4>
                      <h4>Region:<span> ${country.region}</span></h4>
                      <h4>Capital:<span> ${country.capital}</span></h4>
                      <h4>Sub-Region:<span> ${country.subregion}</span></h4>
                    </div>
                    <div>
                      <h4>Top Level Domain:<span> ${
                        country.topLevelDomain
                      }</span></h4>
                      <h4>Currencies:<span> ${
                        country.currencies[0].name
                      }</span></h4>
                      <h4>Languages:<span> ${
                        country.languages[0].name
                      }</span></h4>
                    </div>
                  </div>

                  <div class="borders-container">
                    <h4>Border Countries:</h4>
                    ${country.borders
                      .map(
                        border =>
                          ` <a href="#" class="borders">
                          ${border}
                        </a>`
                      )
                      .join('')}
                  </div>
                </div>
              </div>
            </section>`;

  mainContainer.insertAdjacentHTML('beforeend', html);
};

// API
const getFullCountries = async function (url, regionOrName = '') {
  try {
    const response = await fetch(`${url}${regionOrName}`);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    renderFullCountryDetails(...data);
  } catch (err) {
    console.log(err);
  }
};

// Card EVENT
countriesContainer.addEventListener('click', function (event) {
  event.preventDefault();
  const selectedCountry = event.target.closest('.country-card');
  const selectedCountryName =
    selectedCountry.querySelector('.country-name').textContent;

  if (selectedCountry) {
    mainContainer.textContent = '';
    getFullCountries(byNameAPI_URL, selectedCountryName);
  }
});

// Return Button EVENT
mainContainer.addEventListener('click', function (event) {
  if (event.target.closest('.btn-return')) {
    mainContainer.textContent = '';
    mainContainer.append(searchContainer, countriesContainer);
  }
});
