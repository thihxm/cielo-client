import type { RecurrentPaymentSearchResponseModel } from "../models/recurrent-payment/index.js";
import type {
    SearchBinRequestModel,
    SearchBinResponseModel,
    SearchMerchantOrderIdResponseModel,
    SearchTokenRequestModel,
    SearchTokenResponseModel,
    SearchTransactionMerchantOrderIdRequestModel,
    SearchTransactionPaymentIdRequestModel,
    SearchTransactionRecurrentPaymentIdRequestModel,
} from "../models/search/index.js";
import type { TransactionCreditCardResponseModel } from "./../models/credit-card/transaction-credit-card.response.model.js";
import type { HttpClient } from "./http-client.js";

export class Search {
    constructor(private httpClient: HttpClient) {}

    public paymentId(
        params: SearchTransactionPaymentIdRequestModel,
    ): Promise<TransactionCreditCardResponseModel> {
        const options = {
            path: `/1/sales/${params.paymentId}`,
        };

        return this.httpClient.get<TransactionCreditCardResponseModel>(options);
    }

    public merchantOrderId(
        params: SearchTransactionMerchantOrderIdRequestModel,
    ): Promise<SearchMerchantOrderIdResponseModel> {
        const options = {
            path: `/1/sales?merchantOrderId=${params.merchantOrderId}`,
        };

        return this.httpClient.get<SearchMerchantOrderIdResponseModel>(options);
    }

    public recurrent(
        params: SearchTransactionRecurrentPaymentIdRequestModel,
    ): Promise<RecurrentPaymentSearchResponseModel> {
        const options = {
            path: `/1/RecurrentPayment/${params.recurrentPaymentId}`,
        };

        return this.httpClient.get<RecurrentPaymentSearchResponseModel>(
            options,
        );
    }

    public bin(params: SearchBinRequestModel): Promise<SearchBinResponseModel> {
        const options = {
            path: `/1/cardBin/${params.cardBin}`,
        };

        return this.httpClient.get<SearchBinResponseModel>(options);
    }

    public cardtoken(
        params: SearchTokenRequestModel,
    ): Promise<SearchTokenResponseModel> {
        const options = {
            path: `/1/card/${params.cardToken}`,
        };

        return this.httpClient.get<SearchTokenResponseModel>(options);
    }
}
