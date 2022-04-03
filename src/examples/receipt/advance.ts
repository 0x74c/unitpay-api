import unitpay from '../unitpay.js'

const response = await unitpay.offsetAdvance({
	login: 'ya.metin-4@ya.ru',
	paymentId: '2352351',
	cashItems: [
		{
			name: 'Хостинг на 1 месяц',
			count: 1,
			price: 10.34,
		},
	],
})

console.log(response)
