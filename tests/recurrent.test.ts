import { beforeAll, describe, expect, it } from "vitest";

import {
    Cielo,
    type CieloConstructor,
    CieloHttpError,
    type IHttpResponse,
    type RecurrentCreateModel,
    type RecurrentCreateResponse,
    type RecurrentModifyAmountModel,
    type RecurrentModifyCustomerModel,
    type RecurrentModifyIntervalModel,
    type RecurrentModifyModel,
    type RecurrentModifyNextPaymentDateModel,
    type RecurrentPaymentSearchResponseModel,
    type SearchTransactionRecurrentPaymentIdRequestModel,
} from "../src";
import {
    EnumRecurrentPaymentInterval,
    EnumRecurrentPaymentUpdateInterval,
} from "./../src/enums";
import { EnumBrands, EnumCardType } from "../src/enums";

const cieloParams: CieloConstructor = {
    merchantId: "8937bd5b-9796-494d-9fe5-f76b3e4da633",
    merchantKey: "XKGHUBSBKIRXKAVPSKWLVXYCLVJUGTNZLIHPUSYV",
    sandbox: true,
};
const cielo = new Cielo(cieloParams);

const BEFORE_ALL_TIMEOUT = 60 * 1000; // 60 seconds

describe("Recurrent payments", () => {
    let firstRecurrence: RecurrentCreateResponse;

    beforeAll(async (t) => {
        const createRecurrentParams: RecurrentCreateModel = {
            merchantOrderId: "2014113245231706",
            customer: {
                name: "Comprador rec programada",
            },
            payment: {
                type: EnumCardType.CREDIT,
                amount: 1500,
                installments: 1,
                softDescriptor: "123456789ABCD",
                currence: "BRL",
                country: "BRA",
                recurrentPayment: {
                    authorizeNow: true,
                    startDate: "2021-12-01",
                    endDate: "2022-12-01",
                    interval: EnumRecurrentPaymentInterval.SEMIANNUAL,
                },
                creditCard: {
                    cardNumber: "4024007197692931",
                    holder: "Teste Holder",
                    expirationDate: "12/2030",
                    securityCode: "262",
                    saveCard: false,
                    brand: "Visa" as EnumBrands,
                },
            },
        };

        firstRecurrence = await cielo.recurrent.create(createRecurrentParams);
    }, BEFORE_ALL_TIMEOUT);

    it("Should create a recurrent payment", () => {
        expect(firstRecurrence).toBeDefined();
    });

    it("Should have a valid reason code", () => {
        expect(firstRecurrence.payment.recurrentPayment.reasonCode).toBe(0);
    });

    it("Should have a valid status", () => {
        expect(firstRecurrence.payment.status).toBe(1);
    });

    it("Should have the correct recurrence interval", () => {
        expect(firstRecurrence.payment.recurrentPayment.interval).toBe(6);
    });

    describe("Update recurrence interval", () => {
        let response: IHttpResponse;
        beforeAll(async () => {
            const modifyRecurrenceParams: RecurrentModifyIntervalModel = {
                paymentId:
                    firstRecurrence.payment.recurrentPayment.recurrentPaymentId,
                interval: EnumRecurrentPaymentUpdateInterval.MONTHLY,
            };
            response = await cielo.recurrent.modifyInterval(
                modifyRecurrenceParams,
            );
        }, BEFORE_ALL_TIMEOUT);

        it("Should update the recurrence interval", () => {
            expect(response).toBeDefined();
        });

        it("Should have correct response code", () => {
            expect(response.status).toBe(200);
        });
    });

    describe("Update customer", () => {
        let response: IHttpResponse;
        beforeAll(async () => {
            const updateCustomer: RecurrentModifyCustomerModel = {
                paymentId:
                    firstRecurrence.payment.recurrentPayment.recurrentPaymentId,
                customer: {
                    name: "Customer",
                    email: "customer@teste.com",
                    birthdate: "1999-12-12",
                    identity: "22658954236",
                    identityType: "CPF",
                    address: {
                        street: "Rua Teste",
                        number: "174",
                        complement: "AP 201",
                        zipCode: "21241140",
                        city: "Rio de Janeiro",
                        state: "RJ",
                        country: "BRA",
                    },
                    deliveryAddress: {
                        street: "Outra Rua Teste",
                        number: "123",
                        complement: "AP 111",
                        zipCode: "21241111",
                        city: "Qualquer Lugar",
                        state: "QL",
                        country: "BRA",
                    },
                },
            };

            response = await cielo.recurrent.modifyCustomer(updateCustomer);
        }, BEFORE_ALL_TIMEOUT);

        it("Should update the customer", () => {
            expect(response).toBeDefined();
        });

        it("Should have correct response code", () => {
            expect(response.status).toBe(200);
        });
    });

    describe("Update end date", () => {
        let response: IHttpResponse;
        beforeAll(async () => {
            response = await cielo.recurrent.modifyEndDate({
                paymentId:
                    firstRecurrence.payment.recurrentPayment.recurrentPaymentId,
                endDate: "2040-01-09",
            });
        }, BEFORE_ALL_TIMEOUT);

        it("Should update the end date", () => {
            expect(response).toBeDefined();
        });

        it("Should have correct response code", () => {
            expect(response.status).toBe(200);
        });
    });

    describe("Update recurrence day", () => {
        let response: IHttpResponse;
        beforeAll(async () => {
            response = await cielo.recurrent.modifyRecurrenceDay({
                paymentId:
                    firstRecurrence.payment.recurrentPayment.recurrentPaymentId,
                recurrencyDay: 10,
            });
        }, BEFORE_ALL_TIMEOUT);

        it("Should update the recurrence day", () => {
            expect(response).toBeDefined();
        });

        it("Should have correct response code", () => {
            expect(response.status).toBe(200);
        });
    });

    describe("Update amount", () => {
        let response: IHttpResponse;
        beforeAll(async () => {
            const updateAmount: RecurrentModifyAmountModel = {
                paymentId:
                    firstRecurrence.payment.recurrentPayment.recurrentPaymentId,
                amount: 156, // Valor do Pedido em centavos: 156 equivale a R$ 1,56
            };
            response = await cielo.recurrent.modifyAmount(updateAmount);
        }, BEFORE_ALL_TIMEOUT);

        it("Should update the recurrence amount", () => {
            expect(response).toBeDefined();
        });

        it("Should have correct response code", () => {
            expect(response.status).toBe(200);
        });
    });

    describe("Update next payment date", () => {
        let response: IHttpResponse;
        beforeAll(async () => {
            const newRecurrenceDate = new Date();
            newRecurrenceDate.setDate(newRecurrenceDate.getDate() + 7); // Altera para a próxima semana
            const nextRecurrence = `${newRecurrenceDate.getFullYear()}-${
                newRecurrenceDate.getMonth() + 1
            }-${newRecurrenceDate.getDate()}`;

            const updateNextPaymentDate: RecurrentModifyNextPaymentDateModel = {
                paymentId:
                    firstRecurrence.payment.recurrentPayment.recurrentPaymentId,
                nextPaymentDate: nextRecurrence,
            };

            response = await cielo.recurrent.modifyNextPaymentDate(
                updateNextPaymentDate,
            );
        }, BEFORE_ALL_TIMEOUT);

        it("Should update the recurrence interval", () => {
            expect(response).toBeDefined();
        });

        it("Should have correct response code", () => {
            expect(response.status).toBe(200);
        });
    });

    describe("Deactivate recurrence", () => {
        let response: IHttpResponse;
        beforeAll(async () => {
            const deactivateRecurrenceParams: RecurrentModifyModel = {
                paymentId:
                    firstRecurrence.payment.recurrentPayment.recurrentPaymentId,
            };

            response = await cielo.recurrent.deactivate(
                deactivateRecurrenceParams,
            );
        }, BEFORE_ALL_TIMEOUT);

        it("Should deactivate the recurrence", () => {
            expect(response).toBeDefined();
        });

        it("Should have correct response code", () => {
            expect(response.status).toBe(200);
        });
    });

    describe("Deactivate recurrence", () => {
        let foundRecurrence: RecurrentPaymentSearchResponseModel;
        beforeAll(async () => {
            const recurrenceSearchingParams: SearchTransactionRecurrentPaymentIdRequestModel =
                {
                    recurrentPaymentId:
                        firstRecurrence.payment.recurrentPayment
                            .recurrentPaymentId,
                };
            foundRecurrence = await cielo.search.recurrent(
                recurrenceSearchingParams,
            );
        }, BEFORE_ALL_TIMEOUT);

        it("Should find recurrence", () => {
            expect(foundRecurrence).toBeDefined();
        });

        it("Should have correct recurrence status (3 - disabled by merchant)", () => {
            expect(foundRecurrence.recurrentPayment.status).toBe(3);
        });

        it("Should have correct recurrence interval", () => {
            expect(foundRecurrence.recurrentPayment.interval).toBe("Monthly");
        });

        it("Should have the correct customer email", () => {
            expect(foundRecurrence.customer.email).toBe("customer@teste.com");
        });
    });

    describe("Deactivate recurrence", () => {
        let responseError: CieloHttpError;
        beforeAll(async () => {
            try {
                const testeError: RecurrentCreateModel = {
                    merchantOrderId: "12345678",
                    customer: {
                        name: "Fulano de Tal",
                    },
                    payment: {
                        type: EnumCardType.CREDIT,
                        amount: 50,
                        installments: 1,
                        returnUrl: "http://google.com.br",
                        recurrentPayment: {
                            authorizeNow: true,
                            endDate: "2020-12-12",
                            interval: EnumRecurrentPaymentInterval.MONTHLY,
                        },
                        creditCard: {
                            cardNumber: "522aaa4049 1585 0591",
                            holder: "Fulano de Tal",
                            expirationDate: "05/2022",
                            securityCode: "111",
                            saveCard: false,
                            brand: EnumBrands.MASTER,
                        },
                    },
                };

                await cielo.recurrent.create(testeError);
            } catch (error) {
                if (error instanceof CieloHttpError) {
                    responseError = error;
                }
            }
        }, BEFORE_ALL_TIMEOUT);

        it("Should deactivate the recurrence", () => {
            expect(responseError).toBeDefined();
        });

        it("Should have correct response code", () => {
            expect(responseError.status).not.toBe(200);
        });
    });
});
