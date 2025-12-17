import type { CancelTransactionResponseModel } from "../models/credit-card/cancel-transaction.response.model.js";
import type {
    PIXCancelTransactionRequestModel,
    PIXTransactionRequestModel,
    PIXTransactionResponseModel,
} from "../models/pix/index.js";
import type { HttpClient } from "./http-client.js";

export class PIX {
    constructor(private httpClient: HttpClient) {}

    public transaction(
        transaction: PIXTransactionRequestModel,
    ): Promise<PIXTransactionResponseModel> {
        return this.httpClient.postToSales<
            PIXTransactionResponseModel,
            PIXTransactionRequestModel
        >(transaction);
    }

    public cancelTransaction(
        cancelTransactionRequest: PIXCancelTransactionRequestModel,
    ): Promise<CancelTransactionResponseModel> {
        // Caso seja passado o valor do cancelamento, adiciona na url
        const amount = cancelTransactionRequest.amount
            ? `?amount=${cancelTransactionRequest.amount}`
            : "";

        const path = cancelTransactionRequest.paymentId
            ? `/1/sales/${cancelTransactionRequest.paymentId}/void${amount}`
            : `/1/sales/OrderId/${cancelTransactionRequest.merchantOrderId}/void${amount}`;

        const params = { path };

        return this.httpClient.put<CancelTransactionResponseModel, object>(
            params,
            {},
        );
    }
}
