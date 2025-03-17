const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
// Using environment variable for the token
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_API_KEY;

// NBA Players custom object ID - you'll need to replace this with your actual custom object ID
const NBA_PLAYERS_OBJECT_ID = '2-42077582'; // Replace with your actual custom object ID

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const nbaPlayersEndpoint = `https://api.hubapi.com/crm/v3/objects/${NBA_PLAYERS_OBJECT_ID}?properties=name,position,team`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    
    try {
        const resp = await axios.get(nbaPlayersEndpoint, { headers });
        console.log('API Response:', JSON.stringify(resp.data, null, 2));
        const players = resp.data.results;
        console.log('Players:', players);
        res.render('homepage', { 
            title: 'NBA Players | Integrating With HubSpot I Practicum',
            players: players 
        });
    } catch (error) {
        console.error('Error fetching NBA players:', error.response ? error.response.data : error.message);
        res.status(500).render('error', { 
            title: 'Error | Integrating With HubSpot I Practicum',
            message: 'Error fetching NBA players data'
        });
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', { 
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const playerData = {
        properties: {
            name: req.body.name,
            position: req.body.position,
            team: req.body.team
        }
    };
    
    const nbaPlayersEndpoint = `https://api.hubapi.com/crm/v3/objects/${NBA_PLAYERS_OBJECT_ID}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    
    try {
        await axios.post(nbaPlayersEndpoint, playerData, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating NBA player:', error.response ? error.response.data : error.message);
        res.status(500).render('error', { 
            title: 'Error | Integrating With HubSpot I Practicum',
            message: 'Error creating NBA player record'
        });
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));