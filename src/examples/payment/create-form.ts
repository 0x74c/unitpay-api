import unitpay from '../unitpay.js'

const response = unitpay.form('1242-SDFDS', {
	sum: 200.34,
	desc: 'buy iphone 13 pro max',
	account: '1',
})

console.log(response)
