export interface CieloHttpClientOptions {
    transactionalURL: string;
    queryURL: string;
    merchantId: string;
    merchantKey: string;
    requestId?: string | undefined;
    debug?: boolean | undefined;
}
