import type { PaymentResponseModel } from "./../payment.response.model";
import type { CustomerModel } from "./../customer.model";

export interface TransactionCreditCardResponseModel {
    merchantOrderId: string;
    customer: CustomerModel;
    payment: PaymentResponseModel;
}
