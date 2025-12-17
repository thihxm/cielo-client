import { beforeAll, describe, expect, it } from "vitest";
import { type EnumBrands, EnumCardType } from "../src/enums.js";
import type {
    SearchTokenResponseModel,
    TokenizeResponseModel,
    TransactionCreditCardResponseModel,
} from "../src/index.js";
import type { TokenizeRequestModel } from "../src/models/card/tokenize.request.model.js";
import type { TransactionCreditCardRequestModel } from "../src/models/credit-card/transaction-credit-card.request.model.js";
import type { SearchTokenRequestModel } from "../src/models/search/search-token.request.model.js";
import { Cielo, type CieloConstructor } from "./../src/cielo.js";

const regexToken = new RegExp(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/);
const brands = [
    "Visa",
    "Master",
    "Amex",
    "Elo",
    "Aura",
    "JCB",
    "Diners",
    "Discover",
];

const cieloParams: CieloConstructor = {
    merchantId: "8937bd5b-9796-494d-9fe5-f76b3e4da633",
    merchantKey: "XKGHUBSBKIRXKAVPSKWLVXYCLVJUGTNZLIHPUSYV",
    sandbox: true,
};
const cielo = new Cielo(cieloParams);

const BEFORE_ALL_TIMEOUT = 60 * 1000; // 60 seconds

describe.each(brands)("[%s] Card tokenization", (brand) => {
    const CARD_NUMBER = "4000000000002701";
    const CARD_HOLDER = "Comprador T Cielo";

    let token: TokenizeResponseModel;

    beforeAll(async () => {
        const tokenParams: TokenizeRequestModel = {
            customerName: "Comprádor Teste Cíéló Áá",
            cardNumber: CARD_NUMBER,
            holder: CARD_HOLDER,
            expirationDate: "10/2026",
            brand: brand as EnumBrands,
        };

        token = await cielo.card.createTokenizedCard(tokenParams);
    }, BEFORE_ALL_TIMEOUT);

    it("Should tokenize the card", () => {
        expect(token).toBeDefined();
    });

    it("Should have cardToken", () => {
        expect("cardToken" in token).toBe(true);
    });

    it("Should have a valid cardToken", () => {
        expect(regexToken.test(token.cardToken)).toBe(true);
    });

    describe(`Using the tokenized card for brand ${brand}`, () => {
        let sale: TransactionCreditCardResponseModel;

        beforeAll(async () => {
            const saleParams: TransactionCreditCardRequestModel = {
                merchantOrderId: "CieloNodeJS000003",
                customer: {
                    name: "Comprádor Teste Cíéló Áá",
                },
                payment: {
                    type: EnumCardType.CREDIT,
                    amount: 100,
                    installments: 1,
                    softDescriptor: "123456789ABCD",
                    creditCard: {
                        cardToken: token.cardToken,
                        securityCode: "262",
                        brand: brand as EnumBrands,
                    },
                },
            };

            sale = await cielo.creditCard.transaction(saleParams);
        }, BEFORE_ALL_TIMEOUT);

        it("Should process a sale with the tokenized card", () => {
            expect(sale).toBeDefined();
        });

        it("Should have a valid status", () => {
            expect(sale.payment.status).toBe(1);
        });

        it("Should have a valid PaymentId", () => {
            expect(regexToken.test(sale.payment.paymentId)).toBe(true);
        });

        it("Should have the correct transaction amount", () => {
            expect(sale.payment.amount).toBe(100);
        });

        it("Should normalize the customer's name correctly", () => {
            expect(sale.customer.name).toBe("Comprador Teste Cielo Aa");
        });
    });

    describe(`Searching the tokenized card for brand ${brand}`, () => {
        let searchedToken: SearchTokenResponseModel;

        beforeAll(async () => {
            const searchTokenParams: SearchTokenRequestModel = {
                cardToken: token.cardToken,
            };

            searchedToken = await cielo.search.cardtoken(searchTokenParams);
        }, BEFORE_ALL_TIMEOUT);

        it("Should find the tokenized card", () => {
            expect(searchedToken).toBeDefined();
        });

        it("Should have the correct holder", () => {
            expect(searchedToken.holder).toBe(CARD_HOLDER);
        });

        it("Should have the correct card number ending", () => {
            expect(
                searchedToken.cardNumber.endsWith(CARD_NUMBER.slice(-4)),
            ).toBe(true);
        });
    });
});
