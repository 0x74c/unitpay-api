import 'mocha'
import { expect } from 'chai'
import { generateSignature, base64Encode } from './utils'

describe('generateSignature', () => {
  it('should convert params to signature', () => {
    const testData = {
      paymentType: 'card',
      account: 'reding',
      sum: 1,
      projectId: 12341,
      desc: 'description'
    }
    const result = generateSignature(testData, 'A0066E547A0-C8709E5690D-482EAB1C10')
    const expectedResult = 'c20b53c2ea4771b61d6237eb9f91f7cf45f1c1a156b4ccabb8849ff4638b72b5'

    expect(result).to.equal(expectedResult)
  })
})

describe('base64Encode', () => {
  it('should encode in Base64', () => {
    const testData = [{
      name: 'Хостинг на 1 месяц',
      count: 1,
      price: 10,
      type: 'commodity'
    }]
    const result = base64Encode(JSON.stringify(testData))

    expect(result).to.equal('W3sibmFtZSI6ItCl0L7RgdGC0LjQvdCzINC90LAgMSDQvNC10YHRj9GGIiwiY291bnQiOjEsInByaWNlIjoxMCwidHlwZSI6ImNvbW1vZGl0eSJ9XQ==')
  })
})
