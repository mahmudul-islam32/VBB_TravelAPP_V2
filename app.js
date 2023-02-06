const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path')
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let globalJourneys;

app.post('/search', (req, res) => {
  const from = req.body.from;
  const to = req.body.to;

  Promise.all([
    axios.get(`https://v5.vbb.transport.rest/locations?query=${from}`),
    axios.get(`https://v5.vbb.transport.rest/locations?query=${to}`)
  ])
    .then(([fromResponse, toResponse]) => {
      const fromStopId = fromResponse.data[0].id;
      const toStopId = toResponse.data[0].id;

      return axios.get(`https://v5.vbb.transport.rest/journeys?from=${fromStopId}&to=${toStopId}&results=3`);
    })
    .then((journeysResponse) => {
      const journeys = journeysResponse.data.journeys;

      globalJourneys = journeys;

      res.render('search-results', {
        from: from,
        to: to,
        journeys: journeys
      });
    })
    .catch((error) => {
      res.render('error', { error: error.message });
    });
});


app.get('/journey/:index', (req, res) => {
  const index = req.params.index;
  const journey = globalJourneys[index];
  res.render('journey', { journey });
});


app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
