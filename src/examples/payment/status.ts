import unitpay from '../unitpay.js'

const response = await unitpay.getPayment({
	paymentId: 2_351_412,
})

console.log(response)
