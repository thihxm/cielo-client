import type { Link } from "../link-model.js";

export interface CaptureResponseModel {
    status: number;
    tid: string;
    proofOfSale: string;
    returnCode: string;
    returnMessage: string;
    links: Link[];
}
