require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = "Token";
console.log(PRIVATE_APP_ACCESS);
// Route 1: Display Character List
app.get('/', async (req, res) => {
    try {
        const properties = 'character_name,show_name,liking_number';
        const response = await axios.get(`https://api.hubapi.com/crm/v3/objects/2-43085098?properties=${properties}`, {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Fetched data from HubSpot:", JSON.stringify(response.data, null, 2));
        res.render('homepage', { books: response.data.results });
        
    } catch (error) {
        console.error("Error fetching Character list:", error);
        res.status(500).send('Error fetching Character list');
    }
});

// Route 2: Show Form to Add/Edit
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Add/Edit Character Name' });
});


app.post('/update-cobj', async (req, res) => {
    const { character_name,show_name,liking_number } = req.body;
    try {
        await axios.post(`https://api.hubapi.com/crm/v3/objects/2-43085098`, {
            properties: {
                character_name,
                show_name,
                liking_number
            }
        }, {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                'Content-Type': 'application/json'
            }
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to add/update Character List');
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
