

//event listener for dom content loaded
document.addEventListener('DOMContentLoaded', () => {
    
    //grab elements to manipulate
    let searchInfo = document.querySelector('div.information')
    let searchBar = document.querySelector('input#searchText')
    let searchBtn = document.querySelector('button#searchBtn')
    let unoderedList = document.querySelector('ul#countryList')
    let singleDetailed = document.querySelector('div#singleInformation')
    let form = document.querySelector('form')
    let section = document.querySelector('ul#commentsSection')

    //add search functionality
    searchBtn.addEventListener('click', () => {
        let name = searchBar.value
        unoderedList.innerHTML = ''
        fetchData(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries?namePrefix=${name}&limit=10`).then(resp => {
            for(const result of resp.data){
                renderCountry(result, unoderedList, singleDetailed)
            }
        })
    })

    fetchData("https://wft-geo-db.p.rapidapi.com/v1/geo/countries?limit=10").then(result => {
        for(const country of result.data){

            //iterate over the object and manipulate DOM
            renderCountry(country, unoderedList, singleDetailed)
        }
    })

    form.addEventListener('submit', (e)=> {
        submitComment(e,section)
    })
})

//fetch data
async function fetchData(url){
    const obj ={ 
        method : "GET",
        headers : {
            'X-RapidAPI-Key' : 'a0760444a3msh119cce59cf8be7fp1a083bjsn90c151981805',
            'X-RapidAPI-Host' : 'wft-geo-db.p.rapidapi.com',
            'accept' : 'application/json'
        }
    }
    const response = fetch(url, obj).then(result => result.json())
    return response
}

//render detailed info based on information passed
function renderDetails(data,element){
    fetchData(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${data.code}`).then(resp => {
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

//render information on cities
function renderCities(data, element){
    fetchData(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${data.code}/places?limit=10`).then(resp => {
        for(const result of resp.data){
             let innerInfo = document.createElement('div')
             innerInfo.className = "innerInfo"
            innerInfo.innerHTML = `
                    
                        <div class="cityInfo">
                            <label for="type">Type:</label>
                            <span class="info">${result.type}</span>
                        </div>
                        
                        <div class="cityInfo">
                            <label for="cityname">Name:</label>
                            <span class="info">${result.name}</span>
                        </div>
                        
                        <div class="cityInfo">
                            <label for="population">Population</label>
                            <span class="info">${result.population}</span>
                        </div>
                        <div class="cityInfo">
                            <label for="region">Region</label>
                            <span class="info">${result.region}</span>
                        </div>
                        <div class="cityInfo">
                            <label for="lat">Latitude</label>
                            <span class="info">${result.latitude}</span>
                        </div>
                        <div class="cityInfo">
                            <label for="long">Longitude</label>
                            <span class="info">${result.longitude}</span>
                        </div>
                            
        `
        element.appendChild(innerInfo)
        }
        
       
        
    })
}

//render country
function renderCountry(data, element, element2){
    let singleCountry =document.createElement('div')
            singleCountry.className = "singleInfo"
            singleCountry.innerHTML = `

                            <div class="textValues">
                                <div class="countryDetails">
                                    <label for="countryName">Country Name:</label>
                                    <h3 class="value">${data.name}</h3>
                                </div>
                                <div class="countryDetails">
                                    <label for="abbrv">Abbreviation:</label>
                                    <h4 class="value">${data.code}</h4>
                                </div>
                            </div>
                            <div class="respondingButtons">
                                <button class="respbtns" id="moredetails">More Details</button>
                                <button class="respbtns" id="citiesWithin">PlacesWithin</button>
                            </div>


            `
            element.appendChild(singleCountry)

            //add eventListener to the moredetails button
            let moreDetails = document.querySelector('button#moredetails.respbtns')
            moreDetails.addEventListener('click', () => {
                renderDetails(data, element2)
            })

            let citiesWithin = document.querySelector('button#citiesWithin.respbtns')
            citiesWithin.addEventListener('click', () => {
                renderCities(data, element2)
            })
}

function submitComment(e, section){
    e.preventDefault()
    let obj = {}
    let value = document.querySelector('input#comment').value
    obj.comment = value
    fetch("http://localhost:3000/countries",{
        method : "POST",
        headers : {
            'Content-Type' : 'application/json',
            'accept' : 'application/json'
        },
        body : JSON.stringify(obj)
    }).then(resp => resp.json())
    .then(result => {
        console.log(result, section)
        
            let list = document.createElement('li')
            let commSect = document.createElement('p')
            commSect.textContent = result.comment
            list.appendChild(commSect)
            section.appendChild(list)
        
    })
}