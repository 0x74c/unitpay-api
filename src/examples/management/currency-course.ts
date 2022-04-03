import unitpay from '../unitpay.js'

const response = await unitpay.getCurrencyCourses({
	login: 'ya.metin-4@ya.ru',
})

console.log(response)
