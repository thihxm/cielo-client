import type {
    DebitCardSimpleTransactionRequestModel,
    DebitCardSimpleTransactionResponseModel,
} from "../models/debit-card";
import type { HttpClient } from "./http-client";

export class DebitCard {
    constructor(private httpClient: HttpClient) {}

    public createSimpleTransaction(
        transaction: DebitCardSimpleTransactionRequestModel,
    ): Promise<DebitCardSimpleTransactionResponseModel> {
        return this.httpClient.postToSales<
            DebitCardSimpleTransactionResponseModel,
            DebitCardSimpleTransactionRequestModel
        >(transaction);
    }
}
