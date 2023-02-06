// Variables to store the user's current stop and destination stop
let currentStop;
let destinationStop;

// Function to get the stops based on user input
const getStops = async (input) => {
  const response = await fetch(url + input);
  const data = await response.json();
  return data;
};

// Function to display the stops in a dropdown list
const displayStops = async () => {
  const stops = await getStops(currentStop);

  const stopsList = document.getElementById('stops-list');
  stopsList.innerHTML = '';

  for (let i = 0; i < stops.length; i++) {
    const option = document.createElement('option');
    option.value = stops[i].id;
    option.innerHTML = stops[i].name;
    stopsList.appendChild(option);
  }
};

// Function to get the transport options available at the selected stop
const getStopDetails = async (stopId) => {
  const response = await fetch(url1 + stopId);
  const data = await response.json();
  return data;
};

// Function to display the transport options at the selected stop
const displayStopDetails = async (stopId) => {
  const stopDetails = await getStopDetails(stopId);
  const transportOptions = stopDetails.products;

  const optionsList = document.getElementById('options-list');
  optionsList.innerHTML = '';

  for (let i = 0; i < transportOptions.length; i++) {
    const listItem = document.createElement('li');
    listItem.innerHTML = transportOptions[i];
    optionsList.appendChild(listItem);
  }
};

// Function to get the journeys between two stops
const getJourneys = async (fromId, toId) => {
  const response = await fetch(
    'https://v5.vbb.transport.rest/journeys?from=' + fromId + '&to=' + toId + '&results=3'
  );
  const data = await response.json();
  return data;
};

// Function to display the journey options between two stops
const displayJourneys = async (fromId, toId) => {
  const journeys = await getJourneys(fromId, toId);
  const journeysList = journeys.journeys;

  const journeysContainer = document.getElementById('journeys-container');
  journeysContainer.innerHTML = '';

  for (let i = 0; i < journeysList.length; i++) {
    const journeyDiv = document.createElement('div');
    journeyDiv.innerHTML = 'Journey ' + (i + 1) + ': ' + journeysList[i].duration + ' minutes';
    journeysContainer.appendChild(journeyDiv);
  }
};

// Function to handle the form submit event
const handleSubmit = (event) => {
  event.preventDefault();

  currentStop = document.getElementById('current-stop').value;
  destinationStop = document.getElementById('destination-stop').value;

  displayStops();
};

// Function to handle the stop selection event

const handleStopSelection = (event) => {
    const selectedStop = event.target.value;
    displayStopDetails(selectedStop);
    displayJourneys(selectedStop, destinationStop);
    };
        
   // Add event listeners for form submit and stop selection
            const form = document.getElementById('search-form');
            form.addEventListener('submit', handleSubmit);
            
            const stopsList = document.getElementById('stops-list');
            stopsList.addEventListener('change', handleStopSelection);