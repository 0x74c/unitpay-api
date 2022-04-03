import process from 'node:process'
import Unitpay from '../index.js'

export default new Unitpay({
	domain: process.env.UNITPAY_DOMAIN ?? '',
	secretKey: process.env.UNITPAY_SECRETKEY ?? '',
})
