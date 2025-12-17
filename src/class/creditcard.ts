import type {
    CancelTransactionRequestModel,
    CaptureRequestModel,
    CaptureResponseModel,
    TransactionCreditCardRequestModel,
    TransactionCreditCardResponseModel,
} from "../models/credit-card/index.js";
import type { CancelTransactionResponseModel } from "./../models/credit-card/cancel-transaction.response.model.js";
import type { HttpClient } from "./http-client.js";

export class CreditCard {
    constructor(private httpClient: HttpClient) {}

    public transaction(
        transaction: TransactionCreditCardRequestModel,
    ): Promise<TransactionCreditCardResponseModel> {
        return this.httpClient.postToSales<
            TransactionCreditCardResponseModel,
            TransactionCreditCardRequestModel
        >(transaction);
    }

    public captureSaleTransaction(
        transaction: CaptureRequestModel,
    ): Promise<CaptureResponseModel> {
        const params = {
            path: `/1/sales/${transaction.paymentId}/capture`,
        };

        if (transaction.amount && transaction.amount > 0) {
            params.path = `${params.path}?amount=${transaction.amount}`;
        }

        return this.httpClient.put<CaptureResponseModel, object>(params, {});
    }

    public cancelTransaction(
        cancelTransactionRequest: CancelTransactionRequestModel,
    ): Promise<CancelTransactionResponseModel> {
        // Caso seja passado o valor do cancelamento, adiciona na url
        const amount = cancelTransactionRequest.amount
            ? `?amount=${cancelTransactionRequest.amount}`
            : "";
        const path = cancelTransactionRequest.paymentId
            ? `/1/sales/${cancelTransactionRequest.paymentId}/void${amount}`
            : `/1/sales/OrderId/${cancelTransactionRequest.merchantOrderId}/void${amount}`;

        const params = {
            path: path,
        };

        return this.httpClient.put<CancelTransactionResponseModel, object>(
            params,
            {},
        );
    }
}
