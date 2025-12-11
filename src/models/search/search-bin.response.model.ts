export interface SearchBinResponseModel {
    status: string;
    provider: string;
    cardType: string;
    foreignCard: boolean;
    corporateCard: boolean;
    issuer: string;
    issuerCode: string;
}
