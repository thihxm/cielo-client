import type { SearchPayment } from "../search-payment.model.js";

export interface SearchMerchantOrderIdResponseModel {
    reasonCode: number;
    reasonMessage: string;
    payments: SearchPayment[];
}
