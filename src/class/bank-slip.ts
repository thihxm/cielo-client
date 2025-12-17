import type {
    BankSlipCreateRequestModel,
    BankSlipCreateResponseModel,
} from "../models/bank-slip/index.js";
import type { HttpClient } from "./http-client.js";

export class BankSlip {
    constructor(private httpClient: HttpClient) {}

    public create(
        request: BankSlipCreateRequestModel,
    ): Promise<BankSlipCreateResponseModel> {
        return this.httpClient.postToSales<
            BankSlipCreateResponseModel,
            BankSlipCreateRequestModel
        >(request);
    }
}
