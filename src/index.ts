import got, { Got } from 'got'
import { stringify } from 'qs'
import { base64Encode, getSignature } from './utils.js'

export interface Config {
	domain: string
	secretKey: string
}

export interface GenericResponse<T> {
	result?: T
	error?: {
		message: string
		code?: number
	}
}

export type PaymentCode =
	| 'mc'
	| 'card'
	| 'webmoney'
	| 'webmoneyWmr'
	| 'yandex'
	| 'qiwi'
	| 'paypal'
	| 'applepay'
	| 'samsungpay'
	| 'googlepay'
	| 'yandexpay'
	| 'sbp'

export type OperatorCode = 'mts' | 'mf' | 'beeline' | 'tele2'

/** For more details and usage information see [docs](https://help.unitpay.ru/online-cash-register/types-for-online-cashbox)  */
export type TypeReceipt =
	| 'commodity'
	| 'job'
	| 'service'
	| 'intellectual_activity'
	| 'payment'
	| 'agent_commission'
	| 'payment_2'
	| 'another'
	| 'property_right'
	| 'non-operating_gain'
	| 'insurance_premium'
	| 'sales_tax'
	| 'resort_fee'
	| 'deposit'
	| 'expense'
	| 'pension_insurance_ip'
	| 'pension_insurance'
	| 'medical_insurance_ip'
	| 'medical_insurance'
	| 'social_insurance'
	| 'excise_without_mark'
	| 'excise_mark'
	| 'commodity_without_mark'
	| 'commodity_mark'

export type RefundPaymentMethod = 'full_payment' | 'full_prepayment' | 'prepayment' | 'advance'

export type PaymentStatus =
	| 'success'
	| 'wait'
	| 'error'
	| 'error_pay'
	| 'error_check'
	| 'refund'
	| 'secure'

export interface PaymentNotification {
	method: 'check' | 'pay' | 'preauth' | 'error' | 'refund'
	params: {
		date: string
		profit: number
		account: string
		orderSum: number
		payerSum: number
		unitpayId: number
		projectId: number
		signature: string
		paymentType: PaymentCode
		orderCurrency: string
		payerCurrency: string
		'3ds'?: number
		test?: number
		phone?: number
		operator?: OperatorCode
		errorMessage?: string
		subscriptionId?: number
	}
}

export interface CashItem {
	[key: string]: any
	name: string
	count: number
	price: number
	nds?: 'none' | 'vat0' | 'vat10' | 'vat20'
	type?: TypeReceipt
	currency?: string
	paymentMethod?: RefundPaymentMethod
	markCode?: string
	quantity?: number
	measure?: number
	markQuantity?: Array<{
		numerator: number
		denominator: number
	}>
}

export interface InitPaymentRequest {
	[key: string]: any
	ip: string
	sum: number
	desc: string
	account: string
	projectId: number
	resultUrl: string
	paymentType: PaymentCode
	local?: string
	phone?: number
	backUrl?: string
	currency?: string
	operator?: OperatorCode
	signature?: string
	subscription?: boolean
	subscriptionId?: number
	/** Creating a payment with preauthorization */
	preauth?: boolean
	preauthExpireLogic?: number
	/** Receipt formation */
	cashItems?: CashItem[] | string
	customerEmail?: string
	customerPhone?: number
}

export interface FormPayment {
	sum: number
	desc: string
	account: string
	locale?: string
	backUrl?: string
	currency?: string
	signature?: string
	subscription?: boolean
	/** Receipt formation */
	cashItems?: CashItem[] | string
	customerEmail?: string
	customerPhone?: number
}

export interface InitPaymentResponse {
	type: 'redirect' | 'response' | 'invoice'
	message: string
	paymentId: number
	receiptUrl: string
	response?: string | Record<string, unknown>
	invoiceId?: string
	redirectUrl?: string
}

export interface GetPaymentRequest {
	[key: string]: any
	paymentId: number
}

export interface RefundPaymentRequest {
	[key: string]: any
	paymentId: number
	cashItems?: CashItem[] | string
}

export interface ConfirmPaymentRequest {
	[key: string]: any
	paymentId: number
}

export interface CancelPaymentRequest {
	[key: string]: any
	paymentId: number
}

export interface ListSubscriptionsRequest {
	[key: string]: any
	projectId: number
}

export interface ListSubscriptionsResponse {
	status: 'new' | 'active' | 'close'
	totalSum: number
	startDate: string
	description: string
	failPayments: number
	lastPaymentId: number
	lastUpdateDate: string
	subscriptionId: number
	successPayments: number
	parentPaymentId: number
	closeType?: 'api' | 'error' | 'abuse'
}

export interface GetPaymentResponse {
	date: string
	purse: string
	profit: number
	status: PaymentStatus
	account: string
	payerSum: number
	orderSum: number
	paymentId: number
	projectId: number
	receiptUrl: string
	paymentType: PaymentCode
	errorMessage: string
	orderCurrency: string
	payerCurrency: string
}

export interface BasicResponse {
	message: string
}

export interface GetSubscriptionRequest {
	[key: string]: any
	subscriptionId: number
}

export interface CloseSubscriptionRequest {
	[key: string]: any
	subscriptionId: number
}

export interface MassPaymentRequest {
	[key: string]: any
	sum: number
	login: string
	purse: string
	paymentType: PaymentCode
	transactionId: string
	comment?: string
	projectId?: number
}

export interface MassPaymentResponse {
	sum: number
	status: 'success' | 'not_completed'
	message: string
	payoutId: number
	createDate: string
	completeDate: string
	partnerBalance: number
	payoutCommission: number
	partnerCommission: number
}

export interface MassPaymentStatusRequest {
	[key: string]: any
	login: string
	transactionId: string
}

export interface GetBinInfoRequest {
	[key: string]: any
	login: string
	bin: number
}

export interface GetBinInfoResponse {
	bin: string
	bank: string
	type: string
	brand: string
	bankUrl: string
	category: string
	bankPhone: string
	countryCode: string
}

export interface OffsetAdvanceRequest {
	[key: string]: any
	login: string
	paymentId: string
	cashItems: CashItem[] | string
}

export interface GetPartnerRequest {
	[key: string]: any
	login: string
}

export interface GetPartnerResponse {
	email: string
	balance: number
	balance_payout: number
}

export interface GetCommissionsRequest {
	[key: string]: any
	projectId: number
	login: string
}

export type GetCommissionsResponse = Record<PaymentCode, number>

export interface GetCurrencyCoursesRequest {
	[key: string]: any
	login: string
}

export interface GetCurrencyCoursesResponse {
	in: Record<string, number>
	out: Record<string, number>
}

export type Payload = Record<string, any>

export default class Unitpay {
	private readonly config: Config
	private readonly got: Got

	constructor(config: Config) {
		this.config = config
		this.got = got.extend({
			prefixUrl: `https://${this.config.domain}/api`,
			responseType: 'json',
		})
	}

	public async request<T>(method: string, payload: Payload = {}): Promise<GenericResponse<T>> {
		if (!this.config.secretKey) {
			throw new Error('secretKey mismatch')
		}

		const response = await this.got.get<GenericResponse<T>>({
			searchParams: stringify({
				method,
				params: {
					...payload,
					secretKey: this.config.secretKey,
				},
			}),
			resolveBodyOnly: true,
		})

		return response
	}

	/** For more details and usage information see [docs](https://help.unitpay.ru/payments/create-payment) */
	public async initPayment(
		body: InitPaymentRequest,
	): Promise<GenericResponse<InitPaymentResponse>> {
		if (body.cashItems && typeof body.cashItems !== 'string') {
			body.cashItems = base64Encode(body.cashItems)
		}

		if (!body.signature) {
			const signature = getSignature(body, this.config.secretKey)
			body.signature = signature
		}

		return this.request<InitPaymentResponse>('initPayment', body)
	}

	/** For more details and usage information see [docs](https://help.unitpay.ru/payments/create-payment-easy) */
	public form(publicKey: string, parameters: FormPayment): string {
		if (!publicKey) {
			throw new Error('publicKey mismatch')
		}

		if (parameters.cashItems && typeof parameters.cashItems !== 'string') {
			parameters.cashItems = base64Encode(parameters.cashItems)
		}

		if (!parameters.signature) {
			const signature = getSignature(parameters, this.config.secretKey)
			parameters.signature = signature
		}

		return `https://${this.config.domain}/pay/${publicKey}?${stringify(parameters)}`
	}

	/** For more details and usage information see [docs](https://help.unitpay.ru/payments/payment-info) */
	public async getPayment(body: GetPaymentRequest): Promise<GenericResponse<GetPaymentResponse>> {
		return this.request<GetPaymentResponse>('getPayment', body)
	}

	/** For more details and usage information see [docs](https://help.unitpay.ru/payments/payment-refund) */
	public async refundPayment(body: RefundPaymentRequest): Promise<GenericResponse<BasicResponse>> {
		if (body.cashItems && typeof body.cashItems !== 'string') {
			body.cashItems = base64Encode(body.cashItems)
		}

		return this.request<BasicResponse>('refundPayment', body)
	}

	/** For more details and usage information see [docs](https://help.unitpay.ru/payments/pre-authorization-payments) */
	public async confirmPayment(
		body: ConfirmPaymentRequest,
	): Promise<GenericResponse<BasicResponse>> {
		return this.request<BasicResponse>('confirmPayment', body)
	}

	/** For more details and usage information see [docs](https://help.unitpay.ru/payments/pre-authorization-payments) */
	public async cancelPayment(body: CancelPaymentRequest): Promise<GenericResponse<BasicResponse>> {
		return this.request<BasicResponse>('cancelPayment', body)
	}

	/** For more details and usage information see [docs](https://help.unitpay.ru/payments/recurring-payments/subscription-list) */
	public async listSubscriptions(
		body: ListSubscriptionsRequest,
	): Promise<GenericResponse<ListSubscriptionsResponse>> {
		return this.request<ListSubscriptionsResponse>('listSubscriptions', body)
	}

	/** For more details and usage information see [docs](https://help.unitpay.ru/payments/recurring-payments/subscription-info) */
	public async getSubscription(
		body: GetSubscriptionRequest,
	): Promise<GenericResponse<ListSubscriptionsResponse>> {
		return this.request<ListSubscriptionsResponse>('getSubscription', body)
	}

	/** For more details and usage information see [docs](https://help.unitpay.ru/payments/recurring-payments/close-subscription) */
	public async closeSubscription(
		body: CloseSubscriptionRequest,
	): Promise<GenericResponse<BasicResponse>> {
		return this.request<BasicResponse>('closeSubscription', body)
	}

	/** For more details and usage information see [docs](https://help.unitpay.ru/payouts/create_payout) */
	public async massPayment(
		body: MassPaymentStatusRequest,
	): Promise<GenericResponse<MassPaymentResponse>> {
		return this.request<MassPaymentResponse>('massPayment', body)
	}

	/** For more details and usage information see [docs](https://help.unitpay.ru/payouts/payout_info) */
	public async massPaymentStatus(
		body: MassPaymentStatusRequest,
	): Promise<GenericResponse<MassPaymentResponse>> {
		return this.request<MassPaymentResponse>('massPaymentStatus', body)
	}

	/** For more details and usage information see [docs](https://help.unitpay.ru/payouts/bin_info) */
	public async getBinInfo(body: GetBinInfoRequest): Promise<GenericResponse<GetBinInfoResponse>> {
		return this.request<GetBinInfoResponse>('getBinInfo', body)
	}

	/** For more details and usage information see [docs](https://help.unitpay.ru/online-cash-register/advance_receipt) */
	public async offsetAdvance(body: OffsetAdvanceRequest): Promise<GenericResponse<BasicResponse>> {
		if (body.cashItems && typeof body.cashItems !== 'string') {
			body.cashItems = base64Encode(body.cashItems)
		}

		return this.request<BasicResponse>('offsetAdvance', body)
	}

	/** For more details and usage information see [docs](https://help.unitpay.ru/unitpay-management/balance) */
	public async getPartner(body: GetPartnerRequest): Promise<GenericResponse<GetPartnerResponse>> {
		return this.request<GetPartnerResponse>('getPartner', body)
	}

	/** For more details and usage information see [docs](https://help.unitpay.ru/unitpay-management/commissions) */
	public async getCommissions(
		body: GetCommissionsRequest,
	): Promise<GenericResponse<GetCommissionsResponse>> {
		return this.request<GetCommissionsResponse>('getCommissions', body)
	}

	/** For more details and usage information see [docs](https://help.unitpay.ru/unitpay-management/conversion-rates) */
	public async getCurrencyCourses(
		body: GetCurrencyCoursesRequest,
	): Promise<GenericResponse<GetCurrencyCoursesResponse>> {
		return this.request<GetCurrencyCoursesResponse>('getCurrencyCourses', body)
	}
}
