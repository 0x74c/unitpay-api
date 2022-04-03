import unitpay from '../unitpay.js'

const response = await unitpay.closeSubscription({
	subscriptionId: 23_521_234,
})

console.log(response)
