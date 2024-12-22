"use strict";

(() => {
  document.getElementById("theCountryForm").addEventListener("submit", searchCountries);
  document.getElementById("CountriesButtonSearch").addEventListener("click", fetchTheCountries);

  async function searchCountries(event) {
    event.preventDefault(); 

    const nameOfTheCountry = document.getElementById("nameOfTheCountry").value.trim();
    if (!nameOfTheCountry) {
      alert("Please enter the country name");
      return;
    }

    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${nameOfTheCountry}`
      );
      const countries = await response.json();
      displayStatisticsNum(countries);
    } catch (error) {
      alert("No results found");
    }
  }

  async function fetchTheCountries() {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const countries = await response.json();
      displayStatisticsNum(countries);
    } catch (error) {
      alert("Error fetching data");
    }
  }


  function displayStatisticsNum(countries) {
    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = ""; 

    if (countries.length === 0) {
      productContainer.innerHTML = "No matching countries was found";
      return;
    }

    const sumOfCountries = countries.length;
    const populationSum = countries.reduce(
      (sum, country) => sum + (country.population || 0),
      0
    );
    const averagePopulation =
    sumOfCountries > 0 ? populationSum / sumOfCountries : 0;

    let staticHTML = `
        <h2> Statistics Results:</h2>
        <p><strong>Total countries result: </strong>${sumOfCountries}</p>
        <p><strong>Total countries population: </strong>${populationSum.toLocaleString()}</p>
        <p><strong>Average population: </strong>${Math.round(
          averagePopulation
        ).toLocaleString()}</p>
    `;

    staticHTML += `
        <h3>Country Population Table:</h3>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Country Name</th>
                    <th>Population</th>
                </tr>
            </thead>
            <tbody>
    `;
    countries.forEach((country) => {
      staticHTML += `
            <tr>
                <td>${country.name.common}</td>
                <td>${country.population.toLocaleString()}</td>
            </tr>
        `;
    });

    const countOfRegion = countries.reduce((count, country) => {
      const region = country.region || "Undefined";
      count[region] = (count[region] || 0) + 1;
      return count;
    }, {});

    staticHTML += `
        <h3>Number of countries by Region:</h3>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Region</th>
                    <th>Number of Countries</th>
                </tr>
            </thead>
            <tbody>
    `;
    for (let region in countOfRegion) {
      staticHTML += `
            <tr>
                <td>${region}</td>
                <td>${countOfRegion[region]}</td>
            </tr>
        `;
    }
    staticHTML += "</tbody></table>";

    productContainer.innerHTML = staticHTML;

  }
})();
