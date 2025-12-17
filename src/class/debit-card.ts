import type {
    DebitCardSimpleTransactionRequestModel,
    DebitCardSimpleTransactionResponseModel,
} from "../models/debit-card/index.js";
import type { HttpClient } from "./http-client.js";

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
