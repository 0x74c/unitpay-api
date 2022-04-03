import unitpay from '../unitpay.js'

const response = await unitpay.massPayment({
	login: 'ya.metin-4@ya.ru',
	transactionId: '23652623',
})

console.log(response)
