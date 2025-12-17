import { beforeAll, describe, expect, it } from "vitest";

import { Cielo, type CieloConstructor } from "../src/index.js";
import type {
    PIXTransactionRequestModel,
    PIXTransactionResponseModel,
} from "../src/models/pix/index.js";

const regexToken = new RegExp(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/);

const cieloParams: CieloConstructor = {
    merchantId: "8937bd5b-9796-494d-9fe5-f76b3e4da633",
    merchantKey: "XKGHUBSBKIRXKAVPSKWLVXYCLVJUGTNZLIHPUSYV",
    sandbox: true,
};
const cielo = new Cielo(cieloParams);

const BEFORE_ALL_TIMEOUT = 60 * 1000; // 60 seconds

describe("PIX transaction", () => {
    const TRANSACTION_AMOUNT = 10000;

    let sale: PIXTransactionResponseModel;

    beforeAll(async () => {
        const saleParams: PIXTransactionRequestModel = {
            customer: {
                name: "Comprádor Teste Cíéló Áá",
                identity: "12345678909",
            },
            merchantOrderId: "TypescriptSDK-cielo",
            payment: {
                amount: 10000,
                type: "Pix",
                provider: "Cielo",
                qrCode: {},
            },
        };
        sale = await cielo.pix.transaction(saleParams);
    }, BEFORE_ALL_TIMEOUT);

    it("Should process a PIX transaction", () => {
        expect(sale).toBeDefined();
    });

    it("Should have a valid status", () => {
        expect(sale.payment.status).toBe(12);
    });

    it("Should have a valid PaymentId", () => {
        expect(regexToken.test(sale.payment.paymentId)).toBe(true);
    });

    it("Should have the correct transaction amount", () => {
        expect(sale.payment.amount).toBe(TRANSACTION_AMOUNT);
    });

    it("Should normalize the customer's name correctly", () => {
        expect(sale.customer.name).toBe("Comprador Teste Cielo Aa");
    });
});
