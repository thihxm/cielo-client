import type {
    BankSlipCreateRequestModel,
    BankSlipCreateResponseModel,
} from "../models/bank-slip";
import type { HttpClient } from "./http-client";

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
