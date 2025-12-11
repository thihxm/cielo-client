import { beforeAll, describe, expect, it } from "vitest";

import type {
    DebitCardSimpleTransactionRequestModel,
    DebitCardSimpleTransactionResponseModel,
} from "../src";
import { Cielo, type CieloConstructor } from "./../src/cielo";
import { EnumBrands, EnumCardType } from "../src/enums";

const regexToken = new RegExp(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/);

const cieloParams: CieloConstructor = {
    merchantId: "8937bd5b-9796-494d-9fe5-f76b3e4da633",
    merchantKey: "XKGHUBSBKIRXKAVPSKWLVXYCLVJUGTNZLIHPUSYV",
    sandbox: true,
};
const cielo = new Cielo(cieloParams);

const BEFORE_ALL_TIMEOUT = 60 * 1000; // 60 seconds

describe("Debit Card Transactions", () => {
    const TRANSACTION_AMOUNT = 15700;

    let debitCardTransaction: DebitCardSimpleTransactionResponseModel;

    beforeAll(async () => {
        const transactionParams: DebitCardSimpleTransactionRequestModel = {
            merchantOrderId: "2014121201",
            customer: {
                name: "Teste API",
                identity: "12345678909",
            },
            payment: {
                type: EnumCardType.DEBIT,
                amount: TRANSACTION_AMOUNT,
                provider: "Simulado",
                returnUrl: "http://www.google.com.br",
                debitCard: {
                    cardNumber: "5200000000002151",
                    holder: "Teste Holder",
                    expirationDate: "03/2031",
                    securityCode: "079",
                    brand: EnumBrands.MASTER,
                },
            },
        };

        debitCardTransaction =
            await cielo.debitCard.createSimpleTransaction(transactionParams);
    }, BEFORE_ALL_TIMEOUT);

    it("Should create a debit card transaction", () => {
        expect(debitCardTransaction).toBeDefined();
    });

    it("Should have correct payment status", () => {
        expect(debitCardTransaction.payment.status).toBe(2);
    });

    it("Should have valid payment ID", () => {
        expect(regexToken.test(debitCardTransaction.payment.paymentId)).toBe(
            true,
        );
    });

    it("Should have correct payment amount", () => {
        expect(debitCardTransaction.payment.amount).toBe(TRANSACTION_AMOUNT);
    });
});
