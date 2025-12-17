import type { AirlineDataModel, Link } from "../../index.js";
import type { CustomerModel } from "../customer.model.js";

export type PIXTransactionResponsePayment = {
    qrCode: {
        expiration?: number;
    };
    qrCodeBase64Image: string;
    qrCodeString: string;
    tid: string;
    proofOfSale: string;
    sentOrderId: string;
    amount: number;
    receivedDate?: string;
    extraDataCollection: any[];
    status: number;
    isSplitted: boolean;
    returnMessage: string;
    returnCode: string;
    paymentId: string;
    type: "Pix";
    currency: string;
    country: string;
    links: Link[];
    airlineData?: AirlineDataModel;
    isCryptoCurrencyNegotiation: boolean;
};

export interface PIXTransactionResponseModel {
    merchantOrderId: string;
    customer: CustomerModel;
    payment: PIXTransactionResponsePayment;
}
