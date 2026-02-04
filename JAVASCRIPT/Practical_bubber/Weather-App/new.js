const API_KEY = "2b894fd71873476c9ce210205230410";


async function weatherData() {
    try{
    let searchCity = "goa"
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${searchCity}&days=7&aqi=yes&alerts=no`);
    let data = await response.json()
    console.log(data)

    let newPara = document.createElement('h2')
    newPara.textContent = `${data?.current?.temp_c}`
    document.body.appendChild(newPara)
    }
    catch(err){
        console.log("Error ",err )
    }
}

function switchTab (){
    apiErrorContainer.classList.remove("active");

    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-Tab");

        
    }
}

