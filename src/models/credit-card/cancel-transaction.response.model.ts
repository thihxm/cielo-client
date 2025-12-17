import type { Link } from "../link-model.js";

export interface CancelTransactionResponseModel {
    status: number;
    tid: string;
    proofOfSale: string;
    authorizationCode: string;
    returnCode: string;
    returnMessage: string;
    links: Link[];
}
