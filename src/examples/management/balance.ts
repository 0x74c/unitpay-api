import unitpay from '../unitpay.js'

const response = await unitpay.getPartner({
	login: 'ya.metin-4@ya.ru',
})

console.log(response)
