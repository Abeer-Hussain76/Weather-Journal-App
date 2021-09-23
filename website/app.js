/* Global Variables */
const apiKey = '993e0e80b40247c20743aca7805d23f9&units=metric';
const generate = document.querySelector('#generate');
const card = document.querySelector('.card');
const icon = document.querySelector('#icon img');
const host = 'http://localhost:8000';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate =  d.toDateString();//d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

//add Event on button GENERATE to perform all functions
generate.addEventListener('click', () => {
  
    const feeling = document.querySelector('#feelings').value.trim(); 
    const zip = document.getElementById('zip').value.trim();

    getWeather(zip).then(data => {
      //create object from the data received from the weather api
      const weatherData = {
         temp : Math.round(data.main.temp),
         city : data.name,
         icon : data.weather[0].icon,
         description : data .weather[0].description,
      };
      //create the object which send to the post request
      const newData = { newDate, weatherData, feeling };
      //console.log(newData);  
      //Add Data to POST request
      postData(host + "/add", newData);
      updateUI();
    });
});

// Make a GET request to the OpenWeatherMap API.
const getWeather = async(zip) => {
    const baseURL = 'https://api.openweathermap.org/data/2.5/weather';
    const query = `?zip=${zip},&appid=${apiKey}`;
    try {
        const response = await fetch (baseURL + query);
        const data = await response.json();
            if(data.cod != 200) {
                alert(`${data.message}`);
            }
        //console.log(data);
        return data;
    } catch(err) {
        console.log('Error: ',err);
    } 
};

// Make a POST request to add the API data, as well as data entered by the user.
const postData = async (url = '', newData = {}) => {
  //console.log(newData);
  const response = await fetch (url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData), //turn our data into json data
  });

  try {
    const data = await response.json();
    //console.log(data);
    return data;

  } catch (err) {
    console.log(err);
  }
};

//Make a Get request to retrive the data and Update UI.
const updateUI = async()=> {
    const response = await fetch (host + '/all');
    try {
        const data = await response.json();
        //console.log(data);
        document.getElementById('city').innerHTML = data.weatherData.city;
        document.getElementById('date').innerHTML = data.newDate;
        document.getElementById('description').innerHTML = data.weatherData.description;
        document.getElementById('temp').innerHTML = data.weatherData.temp + '&degC';
        document.getElementById('feel').innerHTML = data.feeling;
        document.getElementById('feel').classList.add('animate');

        const iconSrc = `http://openweathermap.org/img/w/${data.weatherData.icon}.png`;
        icon.setAttribute('src', iconSrc);

    // remove class none 
    if(card.classList.contains('d-none')) {
        card.classList.remove('d-none');
    }
        
    } catch(err) {
    console.log('Error: ', err);
    }
};


