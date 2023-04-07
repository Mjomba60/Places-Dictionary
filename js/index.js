//event listener for dom content loaded
document.addEventListener('DOMContentLoaded', () => {
    
    //grab elements to manipulate
    let searchInfo = document.querySelector('div.information')
    let searchBar = document.querySelector('input#searchText')
    let searchBtn = document.querySelector('button#searchBtn')
    let unoderedList = document.querySelector('ul#countryList')
    let singleDetailed = document.querySelector('div#singleInformation')

    fetchData("https://wft-geo-db.p.rapidapi.com/v1/geo/countries?limit=10", {
        method : "GET",
        headers : {
            'X-RapidAPI-Key' : 'a0760444a3msh119cce59cf8be7fp1a083bjsn90c151981805',
            'X-RapidAPI-Host' : 'wft-geo-db.p.rapidapi.com',
            'accept' : 'application/json'
        }
    }).then(result => {
        for(const country of result.data){

            //iterate over the object and manipulate DOM
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

            //add eventListener to the moredetails button
            let moreDetails = document.querySelector('button#moredetails.respbtns')
            moreDetails.addEventListener('click', () => {
                renderDetails(country, singleDetailed)
            })
        }
    })
})

//fetch data
async function fetchData(url, obj){
    const response = fetch(url, obj).then(result => result.json())
    return response
}

//render detailed info based on information passed
function renderDetails(data,element){
    fetchData(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${data.code}`, { method : "GET",
    headers : {
        'X-RapidAPI-Key' : 'a0760444a3msh119cce59cf8be7fp1a083bjsn90c151981805',
        'X-RapidAPI-Host' : 'wft-geo-db.p.rapidapi.com',
        'accept' : 'application/json'
    }
}).then(resp => {
    element.innerHTML = `
    <img src= ${resp.data.flagImageUri} width="200px" height="180px" alt="Flag Image">
		<div class="cntryFamily">
                        <label for="calling code">Calling code:</label>
                        <span class="info">${resp.data.callingCode}</span>
                    </div>
                    
                    <div class="cntryFamily">
                        <label for="cntryname">Country Name:</label>
                        <span class="info">${resp.data.name}</span>
                    </div>
                    
                    <div class="cntryFamily">
                        <label for="numRegions">Number of Regions</label>
                        <span class="info">${resp.data.numRegions}</span>
                    </div>
    `
})
}