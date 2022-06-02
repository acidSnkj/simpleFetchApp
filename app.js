const https = require('https');
const http = require('http');
const fs = require('fs');
const createIframe = require("node-iframe").default;
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

app.use(createIframe);

// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
router.post('/',function(req,res){
	/*
	// At instance level
	const instance = axios.create({
		httpsAgent: new https.Agent({  
			rejectUnauthorized: false
		})
	});
	instance.post('https://sso-sso-app.apps.ocpdev.air-e.com/auth/realms/api-air-e-pre/protocol/openid-connect/token', {
		'client_id': '5fae2530',
		'client_secret': 'ca4ea505f597d4997180419fa1f1d189'
	}, {
		httpsAgent: agent
	});
	*/
	const axios = require('axios');

	// At request level
	const agent = new https.Agent({  
		rejectUnauthorized: false
	});
	// axios.get('https://something.com/foo', { httpsAgent: agent });
	axios.post('URL',
	 'grant_type=client_credentials&client_id=CLIENT_ID&client_secret=CLIENT_SECRET',
	{
		httpsAgent: agent,
		// 'Content-Type': 'application/json',
		"Content-Type": "application/x-www-form-urlencoded",
	}).then((response) => {
		// console.log('response', response)
		axios.post('URL', "{{PAYLOAD_OBJECT}}",
		{
			httpsAgent: agent,
			withCredentials: true,
			headers: {'Authorization': 'Bearer ' + response.data.access_token},
		}).then((payload) => {
			console.log('payload', payload)
			return res.status(200).send(payload.data);
		}).catch((err) => {
			console.log('err', err)
			return res.status(500).send('err', err)
		})
		// return res.json(response);
	}).catch((e) => {
		console.log('error', e)
		return res.status(500).send('error', e);
		// return res.json(e);
	});
  //res.sendFile(path.join(__dirname+'/index.html'));
	// res.render(path.join('./index.html'), {value: req.query.lel});
	//console.log('req', req.query)
  //__dirname : It will resolve to your project folder.
});




//add the router
app.use('/api', router);

http.createServer({
	// key: fs.readFileSync('/Users/macbook/repositories/simpleZoomApp/server.key'), // where's me key?
	// cert: fs.readFileSync('/Users/macbook/repositories/simpleZoomApp/server.cert'), // where's me cert?
	// key: fs.readFileSync('./air-e_com.pem'), // where's me cert?
	// cert: fs.readFileSync('./air-e_com.crt'), // where's me cert?
	requestCert: false,
	rejectUnauthorized: false,
}, app).listen(3000, () => console.log('Running at Port 3000')); // get creative
// app.listen(process.env.port || 3000);
