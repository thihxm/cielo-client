export interface PIXCancelTransactionRequestModel {
    paymentId?: string;
    merchantOrderId?: string;
    amount?: number;
    [x: string]: any;
}
