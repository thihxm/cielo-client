import type { CustomerModel } from "../customer.model.js";
import type { RecurrentSearchRecurrentPaymentSearchResponseModel } from "./recurrent-search-recurrent-payment-search.response.model.js";

export interface RecurrentPaymentSearchResponseModel {
    customer: CustomerModel;
    recurrentPayment: RecurrentSearchRecurrentPaymentSearchResponseModel;
}
