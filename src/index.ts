import { stringify } from 'qs'

import UnitpayRequest, { IResponse } from './request'
import { generateSignature } from './utils'

export interface IConfig {
  domain: string
  secretKey: string
}

type TGetPaymentStatus = 'success' | 'wait' | 'error' | 'error_pay' | 'error_check' | 'refund' | 'secure'

type TPaymentCode = 'mc' | 'card' | 'webmoney' | 'webmoneyWmr' | 'yandex' | 'qiwi' | 'paypal' | 'applepay' | 'samsungpay' | 'googlepay'

type IOperatorCode = 'mts' | 'mf' | 'beeline' | 'tele2'

export interface ICommonResponse {
  message: string
}

export interface IGetPaymentRequest {
  paymentId: number
}

export interface IGetPaymentResponse {
  date: string
  purse: string
  profit: number
  status: TGetPaymentStatus
  account: string
  payerSum: number
  orderSum: number
  paymentId: number
  projectId: number
  receiptUrl: string
  paymentType: TPaymentCode
  errorMessage: string
  orderCurrency: string
  payerCurrency: string
}

export interface IInitPaymentRequest {
  sum: number
  desc: string
  account: string
  projectId: number
  paymentType: TPaymentCode
  ip?: string
  local?: string
  phone?: number
  backUrl?: string
  currency?: string
  preauth?: boolean
  operator?: IOperatorCode
  resultUrl?: string
  signature?: string
  subscription?: boolean
  subscriptionId?: number
  preauthExpireLogic?: number
}

export interface IInitPaymentResponse {
  type: string
  message: string
  paymentId: number
  receiptUrl: string
  response?: string
  invoiceId?: string
  redirectUrl?: string
}

export type TRefundPaymentMethod = 'full_prepayment' | 'prepayment' | 'advance' | 'full_payment'

export interface IRefundPaymentRequest {
  paymentId: number
  sum?: number
  paymentMethod?: TRefundPaymentMethod
}

export interface IListSubscriptionsRequest {
  projectId: number
}

export interface IListSubscriptionsResponse {
  status: 'new' | 'active' | 'close',
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

export interface IGetSubscriptionRequest{
  subscriptionId: number
}

export interface IOffsetAdvanceRequest {
  login: string
  paymentId: string
  cashItems?: string
}

export interface ICommonPartnerRequest {
  login: string
}

export interface IGetCommissionsRequest extends ICommonPartnerRequest {
  projectId: number
}

export type IGetCommissionsResponse = {
  [key in TPaymentCode]: number
}

export interface IGetCurrencyCoursesResponse {
  in: {
    [key: string]: number
  }
  out: {
    [key: string]: number
  }
}

export interface IGetBinInfoRequest extends ICommonPartnerRequest {
  bin: string
}

export interface IGetBinInfoResponse {
  bin: string
  bank: string
  type: string
  brand: string
  bankUrl: string
  category: string
  bankPhone: string
  countryCode: string
}

export interface IMassPaymentRequest {
  sum: number
  login: string
  purse: string
  paymentType: TPaymentCode
  transactionId: string
  comment?: string
  projectId?: number
}

export interface IMassPaymentResponse {
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

export interface IMassPaymentStatusRequest extends ICommonPartnerRequest {
  transactionId: string
}

export interface IFormParams {
  sum: number
  desc: string
  account: string
  locale?: string
  backUrl?: string
  currency?: string
  signature?: string
}

export default class Unitpay {
  public readonly supportedUnitpayIp = [
    '31.186.100.49',
    '178.132.203.105',
    '52.29.152.23',
    '52.19.56.234'
  ]
  public request: UnitpayRequest
  private config: IConfig
  constructor({ domain = 'unitpay.money', secretKey }: IConfig) {
    this.config = { domain, secretKey }

    this.request = new UnitpayRequest(domain, secretKey)
  }

  public send(method: string, body: any = {}): Promise<any> {
    return this.request.send(method, body)
  }

  public verifyIP(ip: string): boolean {
    return this.supportedUnitpayIp.includes(ip)
  }

  public initPayment(body: IInitPaymentRequest): Promise<IResponse<IInitPaymentResponse>> {
    if(!body.signature) {
      const signature = generateSignature(body, this.config.secretKey)
      body.signature = signature
    }
    return this.send('initPayment', body)
  }

  public form(publicKey: string, params: IFormParams): string {
    if(!publicKey) throw new Error('publicKey mismatch')
    if(!params.signature) {
      const signature = generateSignature(params, this.config.secretKey)
      params.signature = signature
    }

    return `https://${ this.config.domain }/pay/${publicKey}?${stringify(params)}`
  }

  public confirmPayment(body: IGetPaymentRequest): Promise<IResponse<ICommonResponse>> {
    return this.send('confirmPayment', body)
  }

  public cancelPayment(body: IGetPaymentRequest): Promise<IResponse<ICommonResponse>> {
    return this.send('cancelPayment', body)
  }

  public getPayment(body: IGetPaymentRequest): Promise<IResponse<IGetPaymentResponse>> {
    return this.send('getPayment', body)
  }

  public refundPayment(body: IRefundPaymentRequest): Promise<IResponse<ICommonResponse>> {
    return this.send('refundPayment', body)
  }

  public listSubscriptions(body: IListSubscriptionsRequest): Promise<IResponse<IListSubscriptionsResponse>> {
    return this.send('listSubscriptions', body)
  }

  public getSubscription(body: IGetSubscriptionRequest): Promise<IResponse<IListSubscriptionsResponse>> {
    return this.send('getSubscription', body)
  }

  public closeSubscription(body: IGetSubscriptionRequest): Promise<IResponse<ICommonResponse>> {
    return this.send('closeSubscription', body)
  }

  public offsetAdvance(body: IOffsetAdvanceRequest): Promise<IResponse<ICommonResponse>> {
    return this.send('offsetAdvance', body)
  }

  public getPartner(body: ICommonPartnerRequest): Promise<IResponse<ICommonResponse>> {
    return this.send('getPartner', body)
  }

  public getCommissions(body: IGetCommissionsRequest): Promise<IResponse<IGetCommissionsResponse>> {
    return this.send('getPartner', body)
  }

  public getCurrencyCourses(body: ICommonPartnerRequest): Promise<IResponse<IGetCurrencyCoursesResponse>> {
    return this.send('getPartner', body)
  }

  public getBinInfo(body: IGetBinInfoRequest): Promise<IResponse<IGetBinInfoResponse>> {
    return this.send('getBinInfo', body)
  }

  // для физ. лиц (unitpay.money)
  public massPayment(body: IMassPaymentRequest): Promise<IResponse<IMassPaymentResponse>> {
    return this.send('massPayment', body)
  }

  public massPaymentStatus(body: IMassPaymentStatusRequest): Promise<IResponse<IMassPaymentResponse>> {
    return this.send('massPaymentStatus', body)
  }
}