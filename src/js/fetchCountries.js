import debounce from 'lodash.debounce';

const apiUrl = 'https://restcountries.com/v3.1/name/';
const debounceSearchCountry = debounce(searchCountry, 300);

function fetchCountries(country) {
  const countryInfoContainer = document.getElementById('countryInfo');
  countryInfoContainer.innerHTML = `
        <h2>${country.name.common}</h2>
        <p>Stolica: ${country.capital[0]}</p>
        <p>Liczba populacji: ${country.population}</p>
        <p>Języki: ${
          Object.values(country.languages)
            ? Object.values(country.languages).join(', ')
            : 'Brak informacji'
        }</p>
        <img src="${country.flags.svg}" alt="Flaga kraju ${
    country.name.common
  }">
      `;
}

function handleApiResponse(data) {
  const countryInfoContainer = document.getElementById('countryInfo');

  if (Array.isArray(data) && data.length > 0) {
    if (data.length > 10) {
      countryInfoContainer.innerHTML =
        'Too many matches found. Please enter a more specific name.';
    } else if (data.length === 1) {
      const foundCountry = data[0];
      fetchCountries(foundCountry);
    } else {
      countryInfoContainer.innerHTML = 'Znalezione kraje:';
      data.forEach(country => {
        countryInfoContainer.innerHTML += `
              <div>
                <p>${country.name.common}</p>
                <img src="${country.flags.svg}" alt="Flaga kraju ${country.name.common}">
              </div>
            `;
      });
    }
  } else {
    countryInfoContainer.innerHTML = 'Kraj nie został znaleziony.';
  }
}

function searchCountry() {
  const countryInput = document.getElementById('countryInput');
  const countryName = countryInput.value.trim();

  if (countryName === '') {
    const countryInfoContainer = document.getElementById('countryInfo');
    countryInfoContainer.innerHTML = '';
    return;
  }

  const searchUrl = `${apiUrl}${countryName}`;

  fetch(searchUrl)
    .then(response => response.json())
    .then(handleApiResponse)
    .catch(error => {
      console.error('Wystąpił błąd:', error);
    });
}

const countryInput = document.getElementById('countryInput');
countryInput.addEventListener('input', debounceSearchCountry);
