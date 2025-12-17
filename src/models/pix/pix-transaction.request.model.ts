import type { WithRequired } from "../../utils/types.js";
import type { CustomerModel } from "../customer.model.js";
import type { PaymentRequestModel } from "../payment.request.model.js";

export type PIXTransactionRequestPayment = Omit<
    PaymentRequestModel,
    | "currency"
    | "country"
    | "serviceTaxAmount"
    | "installments"
    | "interest"
    | "provider"
    | "capture"
    | "authenticate"
    | "recurrent"
    | "creditCard"
    | "recurrentPayment"
    | "fraudAnalysis"
> & {
    type: "Pix";
    provider: "Cielo" | "Cielo2";
    qrCode: {
        expiration?: number;
    };
};

export interface PIXTransactionRequestModel {
    merchantOrderId: string;
    customer: WithRequired<CustomerModel, "identity">;
    payment: PIXTransactionRequestPayment;
    [x: string]: any;
}
