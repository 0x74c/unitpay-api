import unitpay from '../unitpay.js'

const response = await unitpay.listSubscriptions({
	projectId: 19_586,
})

console.log(response)
