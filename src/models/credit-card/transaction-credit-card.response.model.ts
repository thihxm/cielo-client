import type { CustomerModel } from "./../customer.model.js";
import type { PaymentResponseModel } from "./../payment.response.model.js";

export interface TransactionCreditCardResponseModel {
    merchantOrderId: string;
    customer: CustomerModel;
    payment: PaymentResponseModel;
}
