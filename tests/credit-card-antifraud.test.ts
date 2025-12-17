import { beforeAll, describe, expect, it } from "vitest";

import {
    type EnumBrands,
    EnumCardType,
    EnumCartCategory,
    EnumCartHostHedge,
    EnumCartNonSensicalHedge,
    EnumCartObscenitiesHedge,
    EnumCartPhoneHedge,
    EnumCartTimeHedge,
    EnumCartType,
    EnumCartVelocityHedge,
    EnumSequenceCriteria,
    EnumShippingMethod,
    EnumTravelJourneyType,
    EnumTravelPassengersRating,
    EnumTravelPassengersStatus,
    EnumTypeFlowAnalysisFraud,
} from "../src/enums.js";
import {
    type CancelTransactionRequestModel,
    type CancelTransactionResponseModel,
    type CaptureResponseModel,
    Cielo,
    type CieloConstructor,
    type SearchMerchantOrderIdResponseModel,
    type SearchTransactionMerchantOrderIdRequestModel,
    type SearchTransactionPaymentIdRequestModel,
    type TransactionCreditCardRequestModel,
    type TransactionCreditCardResponseModel,
} from "../src/index.js";
import type { CaptureRequestModel } from "./../src/models/credit-card/capture.request.model.js";

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

describe.each(brands)("[%s] Antifraud credit card sale", (brand) => {
    const TRANSACTION_AMOUNT = 10000;
    const PARTIAL_CAPTURE_AMOUNT = 2000;

    let sale: TransactionCreditCardResponseModel;

    beforeAll(async () => {
        const saleParams: TransactionCreditCardRequestModel = {
            customer: {
                name: "Comprádor Teste Cíéló Áá",
            },
            merchantOrderId: "TypescriptSDK-cielo",
            payment: {
                amount: TRANSACTION_AMOUNT,
                creditCard: {
                    brand: brand as EnumBrands,
                    cardNumber: "4532117080573700",
                    holder: "Comprador T Cielo",
                    expirationDate: "12/2021",
                },
                installments: 1,
                softDescriptor: "Banzeh",
                type: EnumCardType.CREDIT,
                capture: false,
                fraudAnalysis: {
                    provider: "Cybersource",
                    sequence: EnumTypeFlowAnalysisFraud.AnalyseFirst,
                    sequenceCriteria: EnumSequenceCriteria.OnSuccess,
                    captureOnLowRisk: false,
                    voidOnHighRisk: false,
                    totalOrderAmount: 10000,
                    browser: {
                        browserFingerprint: "074c1ee676ed4998ab66491013c565e2",
                        cookiesAccepted: false,
                        email: "comprador@test.com.br",
                        hostName: "Teste",
                        ipAddress: "127.0.0.1",
                        type: "Chrome",
                    },
                    Cart: {
                        isGift: false,
                        returnsAccepted: true,
                        items: [
                            {
                                giftCategory: EnumCartCategory.Off,
                                hostHedge: EnumCartHostHedge.Off,
                                nonSensicalHedge: EnumCartNonSensicalHedge.Off,
                                obscenitiesHedge: EnumCartObscenitiesHedge.Off,
                                phoneHedge: EnumCartPhoneHedge.Off,
                                name: "ItemTeste1",
                                quantity: 1,
                                sku: "20170511",
                                unitPrice: 10000,
                                risk: "High",
                                timeHedge: EnumCartTimeHedge.High,
                                type: EnumCartType.Coupon,
                                velocityHedge: EnumCartVelocityHedge.High,
                            },
                        ],
                    },
                    merchantDefinedFields: [
                        {
                            id: 2,
                            value: "100",
                        },
                        {
                            id: 4,
                            value: "Web",
                        },
                        {
                            id: 9,
                            value: "SIM",
                        },
                    ],
                    shipping: {
                        addressee: "João das Couves",
                        method: EnumShippingMethod.LowCost,
                        phone: "551121840540",
                    },
                    travel: {
                        journeyType: EnumTravelJourneyType.OneWayTrip,
                        departureTime: "2018-01-09 18:00",
                        passengers: [
                            {
                                name: "Passenger Test",
                                identity: "212424808",
                                status: EnumTravelPassengersStatus.Gold,
                                rating: EnumTravelPassengersRating.Adult,
                                email: "email@mail.com",
                                phone: "5564991681074",
                                travelLegs: [
                                    {
                                        origin: "AMS",
                                        destination: "GIG",
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
        };
        sale = await cielo.creditCard.transaction(saleParams);
    }, BEFORE_ALL_TIMEOUT);

    it("Should process sale with antifraud", () => {
        expect(sale).toBeDefined();
    });

    it("Should receive abort status from antifraud", () => {
        expect(sale.payment.fraudAnalysis?.status).toBe(4);
    });

    it("Should have correct payment status", () => {
        expect(sale.payment.status).toBe(1);
    });

    it("Should have a valid paymentId", () => {
        expect(regexToken.test(sale.payment.paymentId)).toBe(true);
    });

    it("Should have the correct transaction amount", () => {
        expect(sale.payment.amount).toBe(TRANSACTION_AMOUNT);
    });

    it("Should normalize the customer's name correctly", () => {
        expect(sale.customer.name).toBe("Comprador Teste Cielo Aa");
    });

    describe("Partial capture", () => {
        let partialCapture: CaptureResponseModel;
        beforeAll(async () => {
            const partialCaptureParams: CaptureRequestModel = {
                paymentId: sale.payment.paymentId,
                amount: PARTIAL_CAPTURE_AMOUNT,
            };
            partialCapture =
                await cielo.creditCard.captureSaleTransaction(
                    partialCaptureParams,
                );
        }, BEFORE_ALL_TIMEOUT);

        it("Should capture partial amount", async () => {
            expect(partialCapture).toBeDefined();
        });

        it("Should have correct partial capture status", () => {
            expect(partialCapture.status).toBe(2);
        });
    });

    describe("Find sale by PaymentId", () => {
        let saleByPaymentId: TransactionCreditCardResponseModel;

        beforeAll(async () => {
            const queryParams: SearchTransactionPaymentIdRequestModel = {
                paymentId: sale.payment.paymentId,
            };
            saleByPaymentId = await cielo.search.paymentId(queryParams);
        }, BEFORE_ALL_TIMEOUT);

        it("Should find the sale by PaymentId", async () => {
            expect(saleByPaymentId).toBeDefined();
        });

        it("Should have correct payment status", () => {
            expect(saleByPaymentId.payment.status).toBeOneOf([1, 2]);
        });

        it("Should have the same TID as the original transaction", () => {
            expect(saleByPaymentId.payment.tid).toBe(sale.payment.tid);
        });

        it("Should have correct captured amount", () => {
            expect(saleByPaymentId.payment.capturedAmount).toBe(
                PARTIAL_CAPTURE_AMOUNT,
            );
        });
    });

    describe("Find sale by MerchantOrderId", () => {
        let saleByMerchantOrderId: SearchMerchantOrderIdResponseModel;

        beforeAll(async () => {
            const queryParams: SearchTransactionMerchantOrderIdRequestModel = {
                merchantOrderId: "TypescriptSDK-cielo",
            };

            saleByMerchantOrderId =
                await cielo.search.merchantOrderId(queryParams);
        }, BEFORE_ALL_TIMEOUT);

        it("Should find sale by MerchantOrderId", () => {
            expect(saleByMerchantOrderId).toBeDefined();
        });

        it("Should have at least one payment", () => {
            expect(saleByMerchantOrderId.payments.length).toBeGreaterThan(0);
        });

        it("Should have at least one payment with the correct paymentId", () => {
            const sales = saleByMerchantOrderId.payments.filter(
                (x) => x.paymentId === sale.payment.paymentId,
            );
            expect(sales).toBeDefined();
            expect(sales.length).toBeGreaterThan(0);
        });
    });

    describe("Cancel sale", () => {
        let cancellationResult: CancelTransactionResponseModel;

        beforeAll(async () => {
            const cancelSaleParams: CancelTransactionRequestModel = {
                paymentId: sale.payment.paymentId,
                amount: sale.payment.amount,
            };
            cancellationResult =
                await cielo.creditCard.cancelTransaction(cancelSaleParams);
        }, BEFORE_ALL_TIMEOUT);

        it("Should cancel the sale", async () => {
            expect(cancellationResult).toBeDefined();
        });

        it("Should have correct cancellation status", () => {
            expect(cancellationResult.status).toBe(10);
        });
    });
});
