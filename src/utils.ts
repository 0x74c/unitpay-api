import crypto from 'node:crypto'
import { Buffer } from 'node:buffer'
import { Payload } from './index.js'

export function parametersToString(parameters: Payload): string {
	const parametersArray = []
	const keys = Object.keys(parameters).sort()

	for (const key of keys) {
		let value = parameters[key] as string | Record<string, unknown>

		if (key === 'signature') {
			continue
		}

		if (value === null || value === undefined) {
			continue
		}

		if (typeof value === 'object' && value !== null) {
			value = parametersToString(value)
		}

		parametersArray.push(value)
	}

	return parametersArray.join('{up}')
}

export function getSignature(parameters: Payload, secretKey: string): string {
	const signatureString = `${parametersToString(parameters)}{up}${secretKey}`

	return crypto.createHash('sha256').update(signatureString, 'utf-8').digest('hex')
}

export function base64Encode(body: Payload): string {
	const buff = Buffer.from(JSON.stringify(body))
	const base64data = buff.toString('base64')

	return base64data
}
