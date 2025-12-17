import type { AirlineDataModel } from "./airline-data.model.js";
import type { CreditCardModel } from "./credit-card.model.js";
import type { FraudAnalysisResponseModel } from "./fraud-analysis/fraud-analysis-response.model.js";
import type { Link } from "./link-model.js";

export interface PaymentResponseModel {
    serviceTaxAmount: number;
    installments: number;
    interest: string;
    capture: boolean;
    authenticate: boolean;
    creditCard: CreditCardModel;
    isCryptoCurrencyNegotiation: boolean;
    tryautomaticcancellation: boolean;
    proofOfSale: string;
    tid: string;
    authorizationCode: string;
    softDescriptor: string;
    paymentId: string;
    type: string;
    amount: number;
    capturedAmount: number;
    country: string;
    airlineData: AirlineDataModel;
    extraDataCollection: any[];
    status: number;
    returnCode: string;
    returnMessage: string;
    links: Link[];
    currency?: string;
    authorizeNow?: boolean;
    receivedDate?: string;
    capturedDate?: string;
    fraudAnalysis?: FraudAnalysisResponseModel;
}
