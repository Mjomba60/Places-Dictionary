//event listener for dom content loaded
document.addEventListener('DOMContentLoaded', () => {
    
    //grab elements to manipulate
    let searchInfo = document.querySelector('div.information')
    let searchBar = document.querySelector('input#searchText')
    let searchBtn = document.querySelector('button#searchBtn')
    let unoderedList = document.querySelector('ul#countryList')

    fetchData("https://wft-geo-db.p.rapidapi.com/v1/geo/countries?limit=10", {
        method : "GET",
        headers : {
            'X-RapidAPI-Key' : 'a0760444a3msh119cce59cf8be7fp1a083bjsn90c151981805',
            'X-RapidAPI-Host' : 'wft-geo-db.p.rapidapi.com',
            'accept' : 'application/json'
        }
    }).then(result => {
        for(const country of result.data){
            let singleCountry =document.createElement('div')
            singleCountry.className = "singleInfo"
            singleCountry.innerHTML = `

                            <div class="textValues">
                                <div class="countryDetails">
                                    <label for="countryName">Country Name:</label>
                                    <h3 class="value">${country.name}</h3>
                                </div>
                                <div class="countryDetails">
                                    <label for="abbrv">Abbreviation:</label>
                                    <h4 class="value">${country.code}</h4>
                                </div>
                            </div>
                            <div class="respondingButtons">
                                <button class="respbtns" id="moredetails">More Details</button>
                                <button class="respbtns" id="citiesWithin">CitiesWithin</button>
                            </div>


            `
            unoderedList.appendChild(singleCountry)
        }
    })
})

//fetch data
async function fetchData(url, obj){
    const response = fetch(url, obj).then(result => result.json())
    return response
}