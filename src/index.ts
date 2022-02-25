import { stringify } from 'qs';

import UnitpayRequest, { IResponse } from './request';
import { base64Encode, generateSignature } from './utils';

export interface IConfig {
  domain?: string;
  secretKey: string;
}

export type TPaymentStatus =
  | 'success'
  | 'wait'
  | 'error'
  | 'error_pay'
  | 'error_check'
  | 'refund'
  | 'secure';

export type TPaymentCode =
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
  | 'yandexpay';

export type IOperatorCode = 'mts' | 'mf' | 'beeline' | 'tele2';

export interface ICommonResponse {
  message: string;
}

export interface IGetPaymentRequest {
  paymentId: number;
}

export interface IGetPaymentResponse {
  date: string;
  purse: string;
  profit: number;
  status: TPaymentStatus;
  account: string;
  payerSum: number;
  orderSum: number;
  paymentId: number;
  projectId: number;
  receiptUrl: string;
  paymentType: TPaymentCode;
  errorMessage: string;
  orderCurrency: string;
  payerCurrency: string;
}

export interface IInitPaymentRequest {
  sum: number;
  desc: string;
  account: string;
  projectId: number;
  paymentType: TPaymentCode;
  ip?: string;
  local?: string;
  phone?: number;
  backUrl?: string;
  currency?: string;
  preauth?: boolean;
  operator?: IOperatorCode;
  resultUrl?: string;
  cashItems?: ICashItem[] | string;
  signature?: string;
  subscription?: boolean;
  customerEmail?: string;
  customerPhone?: number;
  subscriptionId?: number;
  preauthExpireLogic?: number;
}

export interface ICashItem {
  name: string;
  count: number;
  price: number;
  nds?: 'node' | 'vat0' | 'vat10' | 'vat20';
  type?:
    | 'commodity'
    | 'excise'
    | 'job'
    | 'service'
    | 'lottery_prize'
    | 'intellectual_activity'
    | 'agent_commission'
    | 'another'
    | 'property_right'
    | 'non-operating_gain'
    | 'insurance_premium'
    | 'sales_tax'
    | 'resort_fee';
  currency?: string;
  paymentMethod?: TRefundPaymentMethod;
  nomenclatureCode?: string;
}

export interface IInitPaymentResponse {
  type: 'redirect' | 'response' | 'invoice';
  message: string;
  paymentId: number;
  receiptUrl: string;
  response?: string;
  invoiceId?: string;
  redirectUrl?: string;
}

export type TRefundPaymentMethod = 'full_prepayment' | 'prepayment' | 'advance' | 'full_payment';

export interface IRefundPaymentRequest {
  paymentId: number;
  sum?: number;
  cashItems?: ICashItem[] | string;
  customerEmail?: string;
  customerPhone?: number;
  paymentMethod?: TRefundPaymentMethod;
}

export interface IListSubscriptionsRequest {
  projectId: number;
}

export interface IListSubscriptionsResponse {
  status: 'new' | 'active' | 'close';
  totalSum: number;
  startDate: string;
  description: string;
  failPayments: number;
  lastPaymentId: number;
  lastUpdateDate: string;
  subscriptionId: number;
  successPayments: number;
  parentPaymentId: number;
  closeType?: 'api' | 'error' | 'abuse';
}

export interface IGetSubscriptionRequest {
  subscriptionId: number;
}

export interface IOffsetAdvanceRequest {
  login: string;
  paymentId: string;
  cashItems?: ICashItem[] | string;
}

export interface ICommonPartnerRequest {
  login: string;
}

export interface IGetCommissionsRequest extends ICommonPartnerRequest {
  projectId: number;
}

export type IGetCommissionsResponse = {
  [key in TPaymentCode]: number;
};

export interface IGetCurrencyCoursesResponse {
  in: {
    [key: string]: number;
  };
  out: {
    [key: string]: number;
  };
}

export interface IGetBinInfoRequest extends ICommonPartnerRequest {
  bin: string;
}

export interface IGetBinInfoResponse {
  bin: string;
  bank: string;
  type: string;
  brand: string;
  bankUrl: string;
  category: string;
  bankPhone: string;
  countryCode: string;
}

export interface IMassPaymentRequest {
  sum: number;
  login: string;
  purse: string;
  paymentType: TPaymentCode;
  transactionId: string;
  comment?: string;
  projectId?: number;
}

export interface IMassPaymentResponse {
  sum: number;
  status: 'success' | 'not_completed';
  message: string;
  payoutId: number;
  createDate: string;
  completeDate: string;
  partnerBalance: number;
  payoutCommission: number;
  partnerCommission: number;
}

export interface IMassPaymentStatusRequest extends ICommonPartnerRequest {
  transactionId: string;
}

export interface IFormParams {
  sum: number;
  desc: string;
  account: string;
  locale?: string;
  backUrl?: string;
  cashItems?: ICashItem[] | string;
  customerEmail?: string;
  customerPhone?: string;
  test?: 1 | '1';
  currency?: string;
  signature?: string;
}

export interface IGetPartnerResponse {
  email: string;
  balance: number;
  balance_payout: number;
  unitwallet?: {
    rest_balance: number;
    rest_payouts: number;
    rest_ecommerce_payouts_today: number;
    rest_ecommerce_payouts_month: number;
  };
}

export default class Unitpay {
  public readonly supportedUnitpayIp = [
    '31.186.100.49',
    '178.132.203.105',
    '52.29.152.23',
    '52.19.56.234',
  ];
  public request: UnitpayRequest;
  private config: IConfig;
  constructor({ domain = 'unitpay.money', secretKey }: IConfig) {
    this.config = { domain, secretKey };

    this.request = new UnitpayRequest(domain, secretKey);
  }

  public send(method: string, body: any = {}): Promise<any> {
    return this.request.send(method, body);
  }

  public verifyIP(ip: string): boolean {
    return this.supportedUnitpayIp.includes(ip);
  }

  public initPayment(body: IInitPaymentRequest): Promise<IResponse<IInitPaymentResponse>> {
    if (!body.signature) {
      const signature = generateSignature(body, this.config.secretKey);
      body.signature = signature;
    }
    if (body.cashItems && typeof body.cashItems !== 'string') {
      body.cashItems = base64Encode(JSON.stringify(body.cashItems));
    }
    return this.send('initPayment', body);
  }

  public form(publicKey: string, params: IFormParams): string {
    if (!publicKey) throw new Error('publicKey mismatch');
    if (params.cashItems && typeof params.cashItems !== 'string') {
      params.cashItems = base64Encode(JSON.stringify(params.cashItems));
    }
    const sortParams = Object.fromEntries(Object.entries(params).sort());
    const signature = generateSignature(sortParams, this.config.secretKey);
    sortParams.signature = signature;
    return `https://${this.config.domain}/pay/${publicKey}?${stringify(sortParams)}`;
  }

  public confirmPayment(body: IGetPaymentRequest): Promise<IResponse<ICommonResponse>> {
    return this.send('confirmPayment', body);
  }

  public cancelPayment(body: IGetPaymentRequest): Promise<IResponse<ICommonResponse>> {
    return this.send('cancelPayment', body);
  }

  public getPayment(body: IGetPaymentRequest): Promise<IResponse<IGetPaymentResponse>> {
    return this.send('getPayment', body);
  }

  public refundPayment(body: IRefundPaymentRequest): Promise<IResponse<ICommonResponse>> {
    if (body.cashItems && typeof body.cashItems !== 'string') {
      body.cashItems = base64Encode(JSON.stringify(body.cashItems));
    }
    return this.send('refundPayment', body);
  }

  public listSubscriptions(
    body: IListSubscriptionsRequest
  ): Promise<IResponse<IListSubscriptionsResponse>> {
    return this.send('listSubscriptions', body);
  }

  public getSubscription(
    body: IGetSubscriptionRequest
  ): Promise<IResponse<IListSubscriptionsResponse>> {
    return this.send('getSubscription', body);
  }

  public closeSubscription(body: IGetSubscriptionRequest): Promise<IResponse<ICommonResponse>> {
    return this.send('closeSubscription', body);
  }

  public offsetAdvance(body: IOffsetAdvanceRequest): Promise<IResponse<ICommonResponse>> {
    if (body.cashItems && typeof body.cashItems !== 'string') {
      body.cashItems = base64Encode(JSON.stringify(body.cashItems));
    }
    return this.send('offsetAdvance', body);
  }

  public getPartner(body: ICommonPartnerRequest): Promise<IResponse<IGetPartnerResponse>> {
    return this.send('getPartner', body);
  }

  public getCommissions(body: IGetCommissionsRequest): Promise<IResponse<IGetCommissionsResponse>> {
    return this.send('getCommissions', body);
  }

  public getCurrencyCourses(
    body: ICommonPartnerRequest
  ): Promise<IResponse<IGetCurrencyCoursesResponse>> {
    return this.send('getCurrencyCourses', body);
  }

  public getBinInfo(body: IGetBinInfoRequest): Promise<IResponse<IGetBinInfoResponse>> {
    return this.send('getBinInfo', body);
  }

  // для физ. лиц (unitpay.money)
  public massPayment(body: IMassPaymentRequest): Promise<IResponse<IMassPaymentResponse>> {
    return this.send('massPayment', body);
  }

  public massPaymentStatus(
    body: IMassPaymentStatusRequest
  ): Promise<IResponse<IMassPaymentResponse>> {
    return this.send('massPaymentStatus', body);
  }
}
