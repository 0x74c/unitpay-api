import unitpay from '../unitpay.js'

const response = await unitpay.confirmPayment({
	paymentId: 2_351_412,
})

console.log(response)
