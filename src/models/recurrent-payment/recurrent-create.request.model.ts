import type { CustomerModel } from "../customer.model";
import type { PaymentRequestModel } from "../payment.request.model";

export interface RecurrentCreateModel {
    merchantOrderId: string;
    customer: CustomerModel;
    payment: PaymentRequestModel;
    [x: string]: any;
}
