import type { CustomerModel } from "../customer.model";
import type { RecurrentSearchRecurrentPaymentSearchResponseModel } from "./recurrent-search-recurrent-payment-search.response.model";

export interface RecurrentPaymentSearchResponseModel {
    customer: CustomerModel;
    recurrentPayment: RecurrentSearchRecurrentPaymentSearchResponseModel;
}
