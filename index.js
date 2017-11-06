const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

const backupPort = 1337

app.set('port', (process.env.PORT || backupPort))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/', (req, res) => {
	console.log('say what')
	res.send('app commencing')
})

app.post('/webhook', (req, res) => {
	const body = req.body;
	if (body.object === 'page') {
		body.entry.forEach(function(entry) {
			const webhookEvent = entry.messaging[0];
			console.log(webhookEvent);
		});
		res.status(200).send('EVENT_RECEIVED');
	} else {
		res.sendStatus(404);
	}
});

app.get('/webhook', (req, res) => {

	// Your verify token. Should be a random string.
	const VERIFY_TOKEN = "<YOUR_VERIFY_TOKEN>"

	const mode = req.query['hub.mode'];
	const token = req.query['hub.verify_token'];
	const challenge = req.query['hub.challenge'];

	if (mode && token) {
		if (mode === 'subscribe' && token === VERIFY_TOKEN) {
			console.log('WEBHOOK_VERIFIED');
			res.status(200).send(challenge);
		} else {
			res.sendStatus(403);
		}
	}
});

app.listen(app.get('port'), () => console.log('webhook is listening on port', app.get('port')));