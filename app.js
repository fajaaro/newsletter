const express = require('express'),
	  bodyParser = require('body-parser'),
	  request = require('request'),
	  https = require('https'),
	  app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/signup.html`)
})

app.post('/', (req, res) => {
	let fName = req.body.fName,
		lName = req.body.lName,
		email = req.body.email

	let data = {
		members: [
			{
				email_address: email,
				status: 'subscribed',
				merge_fields: {
					FNAME: fName,
					LNAME: lName
				}
			}
		]
	}

	let jsonData = JSON.stringify(data)

	let url = 'https://us10.api.mailchimp.com/3.0/lists/b08c45ba54'

	let options = {
		method: 'POST',
		auth: 'fajaaro:bf759762d6f1c70f937818189d055959-us10'
	}

	let request = https.request(url, options, function(response) {
		if (response.statusCode == 200) res.sendFile(`${__dirname}/success.html`)
		else res.sendFile(`${__dirname}/failure.html`)

		response.on('data', function(data) {
			console.log(JSON.parse(data))
		})
	})

	request.write(jsonData)
	request.end()

	console.log(`${fName} ${lName} ${email}`)
})

app.post('/failure', (req, res) => {
	res.redirect('/')
})

app.listen(process.env.PORT || 3000, function() {
	console.log(`Server is running on port 3000 or ${process.env.PORT}.`)
})

// API Key: bf759762d6f1c70f937818189d055959-us10
// List ID: b08c45ba54