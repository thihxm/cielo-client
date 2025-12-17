import type { CustomerModel } from "../customer.model.js";
import type { PaymentRequestModel } from "../payment.request.model.js";

export interface TransactionCreditCardRequestModel {
    merchantOrderId: string;
    customer: CustomerModel;
    payment: PaymentRequestModel;
    [x: string]: any;
}
