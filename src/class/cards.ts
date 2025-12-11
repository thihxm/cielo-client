import type { TokenizeRequestModel } from "../models/card/tokenize.request.model";
import type { TokenizeResponseModel } from "../models/card/tokenize.response.model";
import type { HttpClient } from "./http-client";

export class Card {
    constructor(private httpClient: HttpClient) {}

    public createTokenizedCard(
        request: TokenizeRequestModel,
    ): Promise<TokenizeResponseModel> {
        return this.httpClient.post<
            TokenizeResponseModel,
            TokenizeRequestModel
        >({ path: "/1/card" }, request);
    }
}
