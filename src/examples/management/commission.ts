import unitpay from '../unitpay.js'

const response = await unitpay.getCommissions({
	login: 'ya.metin-4@ya.ru',
	projectId: 19_586,
})

console.log(response)
