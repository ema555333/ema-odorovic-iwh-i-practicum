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
const NBA_PLAYERS_OBJECT_ID = 'p_nba_players'; // Replace with your actual custom object ID

// ROUTE 1 - Homepage route to display NBA players
app.get('/', async (req, res) => {
    // Updated endpoint to include the player number property
    const nbaPlayersEndpoint = `https://api.hubapi.com/crm/v3/objects/${NBA_PLAYERS_OBJECT_ID}?properties=name,number,position,team`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    
    try {
        const resp = await axios.get(nbaPlayersEndpoint, { headers });
        console.log('API Response:', JSON.stringify(resp.data, null, 2));
        const players = resp.data.results;
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

// ROUTE 2 - Update form route
app.get('/update-cobj', (req, res) => {
    res.render('updates', { 
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// ROUTE 3 - Post route to handle form submission
app.post('/update-cobj', async (req, res) => {
    // Updated to include player number
    const playerData = {
        properties: {
            name: req.body.name,
            number: req.body.number,
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