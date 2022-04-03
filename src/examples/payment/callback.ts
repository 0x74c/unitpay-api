import process from 'node:process'
import express from 'express'
import bodyParser from 'body-parser'
import { PaymentNotification } from '../../index.js'
import { getSignature } from '../../utils.js'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/webhooks/handle_payment', (request, response) => {
	const notification = request.query as unknown as PaymentNotification

	const signature = getSignature(notification, process.env.UNITPAY_SECRETKEY ?? '')

	if (signature !== notification.params.signature) {
		response.send({
			error: {
				message: 'signature mismatch',
				locale: 'en',
			},
		})
	}

	console.log(notification)
	response.send({
		result: {
			message: 'It`s Ok!',
		},
	})
})

app.listen(3000)
