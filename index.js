const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const CUSTOM_OBJECT_TYPE = '2-43085098'; // Your actual custom object type ID

// Homepage Route - Displays records in a table
app.get('/', async (req, res) => {
    // Fetch records from HubSpot and include custom properties
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=character_name,show_name,liking_number`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(url, { headers });
        const records = response.data.results || [];
        console.log('Fetched Records:', records);  // Log records to ensure properties are fetched
        res.render('homepage', {
            title: 'Characters Table',
            records
        });
    } catch (error) {
        console.error('Error fetching records:', error.response?.data || error.message);
        res.render('homepage', {
            title: 'Characters Table',
            records: []
        });
    }
});

// Form Route - Render the form to create a new character
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// Form Submission - Create new custom object record
app.post('/update-cobj', async (req, res) => {
    const { name, bio, customProperty } = req.body;

    console.log('Form Data:', { name, bio, customProperty });  // Log form data for debugging

    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const newRecord = {
        properties: {
            character_name: name,    // Ensure this matches the internal property name
            show_name: bio,          // Ensure this matches the internal property name
            liking_number: customProperty // Ensure this matches the internal property name
        }
    };

    try {
        const response = await axios.post(url, newRecord, { headers });
        console.log('HubSpot Response:', response.data);  // Log HubSpot's response for debugging
        res.redirect('/');  // Redirect to homepage after successful creation
    } catch (error) {
        console.error('Error creating record:', error.response?.data || error.message);
        res.send('Failed to create character');
    }
});


// For debugging purposes, log the private app token (ensure this is loaded properly)
console.log('PRIVATE_APP_ACCESS:', PRIVATE_APP_ACCESS);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
