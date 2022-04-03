import unitpay from '../unitpay.js'

const response = await unitpay.refundPayment({
	paymentId: 2_351_412,
})

console.log(response)
