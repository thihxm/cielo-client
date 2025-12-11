import { assert, beforeAll, describe, expect, it } from "vitest";

import {
    type BankSlipCreateRequestModel,
    type BankSlipCreateResponseModel,
    Cielo,
    type CieloConstructor,
} from "../src";

const cieloParams: CieloConstructor = {
    merchantId: "8937bd5b-9796-494d-9fe5-f76b3e4da633",
    merchantKey: "XKGHUBSBKIRXKAVPSKWLVXYCLVJUGTNZLIHPUSYV",
    sandbox: true,
};
const cielo = new Cielo(cieloParams);

const BEFORE_ALL_TIMEOUT = 60 * 1000; // 60 seconds

describe("Bank slip test", () => {
    let bankSlip: BankSlipCreateResponseModel;

    beforeAll(async () => {
        const bankSlipParams: BankSlipCreateRequestModel = {
            merchantOrderId: "20180531",
            customer: {
                name: "Comprádor Boleto Cíéló Áá",
                identity: "1234567890",
                address: {
                    street: "Avenida Marechal Câmara",
                    number: "160",
                    complement: "Sala 934",
                    zipCode: "22750012",
                    district: "Centro",
                    city: "Rio de Janeiro",
                    state: "RJ",
                    country: "BRA",
                },
            },
            payment: {
                type: "Boleto",
                amount: 15700,
                provider: "Bradesco2",
                address: "Rua Teste",
                boletoNumber: "123",
                assignor: "Empresa Teste",
                demonstrative: "Desmonstrative Teste",
                expirationDate: "5/1/2020",
                identification: "11884926754",
                instructions:
                    "Aceitar somente até a data de vencimento, após essa data juros de 1% dia.",
            },
        };
        bankSlip = await cielo.bankSlip.create(bankSlipParams);
    }, BEFORE_ALL_TIMEOUT);

    it("Should create bank slip successfully", () => {
        expect(bankSlip).toBeDefined();
    });
    it("Should normalize the customer's name correctly", () => {
        expect(bankSlip.customer.name).toBe("Comprador Boleto Cielo Aa");
    });
    it("Should have payment", () => {
        expect(typeof bankSlip.payment).not.toBe("undefined");
    });
    it("Should have bank slip URL", () => {
        assert.isNotEmpty(bankSlip.payment.url.trim());
    });
});
