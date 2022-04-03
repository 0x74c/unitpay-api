import unitpay from '../unitpay.js'

const response = await unitpay.initPayment({
	ip: '1.1.1.1',
	sum: 200.34,
	desc: 'buy iphone 13 pro max',
	account: '1',
	projectId: 19_586,
	resultUrl: 'https://example.com/success',
	paymentType: 'qiwi',
})

console.log(response)
