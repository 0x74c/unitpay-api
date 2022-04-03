import { base64Encode, getSignature } from './utils.js'

describe('generateSignature', () => {
	it('should convert params to signature', () => {
		const testData = {
			paymentType: 'card',
			account: '1',
			sum: 99_999,
			projectId: 97_341,
			desc: 'buy iphone 13 pro max',
		}
		const result = getSignature(testData, 'A0066E547A0-C8709E5690D-482EAB1C10')
		const expectedResult = 'b208495b3171ca8b1036c24ebe2a5ab636731111e9e5e75d9f0ba7db0a6bed33'

		expect(result).toEqual(expectedResult)
	})
})

describe('base64Encode', () => {
	it('should encode in Base64', () => {
		const testData = [
			{
				name: 'Хостинг на 1 месяц',
				count: 1,
				price: 10,
				type: 'commodity',
			},
		]
		const result = base64Encode(testData)

		expect(result).toEqual(
			'W3sibmFtZSI6ItCl0L7RgdGC0LjQvdCzINC90LAgMSDQvNC10YHRj9GGIiwiY291bnQiOjEsInByaWNlIjoxMCwidHlwZSI6ImNvbW1vZGl0eSJ9XQ==',
		)
	})
})
