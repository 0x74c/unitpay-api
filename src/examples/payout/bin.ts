import unitpay from '../unitpay.js'

const response = await unitpay.getBinInfo({
	login: 'ya.metin-4@ya.ru',
	bin: 23_652_623,
})

console.log(response)
