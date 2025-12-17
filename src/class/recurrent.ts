import type {
    CustomerModel,
    PaymentRecurrentModifyModel,
} from "../models/index.js";
import type {
    RecurrentCreateModel,
    RecurrentCreateResponse,
    RecurrentModifyAmountModel,
    RecurrentModifyCustomerModel,
    RecurrentModifyDayModel,
    RecurrentModifyEndDateModel,
    RecurrentModifyIntervalModel,
    RecurrentModifyModel,
    RecurrentModifyNextPaymentDateModel,
} from "../models/recurrent-payment/index.js";
import type { RecurrentModifyPaymentModel } from "../models/recurrent-payment/recurrent-modify-payment.model.js";
import type { HttpClient, IHttpResponse } from "./http-client.js";

export class Recurrent {
    constructor(private httpClient: HttpClient) {}

    public create(
        params: RecurrentCreateModel,
    ): Promise<RecurrentCreateResponse> {
        return this.httpClient.postToSales<
            RecurrentCreateResponse,
            RecurrentCreateModel
        >(params);
    }

    public modifyCustomer(
        params: RecurrentModifyCustomerModel,
    ): Promise<IHttpResponse> {
        const modifyParams = {
            path: `/1/RecurrentPayment/${params.paymentId}/Customer`,
            data: params.customer,
        };
        return this.modify<IHttpResponse>(modifyParams);
    }

    public modifyEndDate(
        params: RecurrentModifyEndDateModel,
    ): Promise<IHttpResponse> {
        const modifyParams = {
            path: `/1/RecurrentPayment/${params.paymentId}/EndDate`,
            data: params.endDate,
        };
        return this.modify<IHttpResponse>(modifyParams);
    }

    public modifyInterval(
        params: RecurrentModifyIntervalModel,
    ): Promise<IHttpResponse> {
        const modifyParams = {
            path: `/1/RecurrentPayment/${params.paymentId}/Interval`,
            data: params.interval,
        };
        return this.modify<IHttpResponse>(modifyParams);
    }

    public modifyRecurrenceDay(
        params: RecurrentModifyDayModel,
    ): Promise<IHttpResponse> {
        const modifyParams = {
            path: `/1/RecurrentPayment/${params.paymentId}/RecurrencyDay`,
            data: params.recurrencyDay,
        };
        return this.modify<IHttpResponse>(modifyParams);
    }

    public modifyAmount(
        params: RecurrentModifyAmountModel,
    ): Promise<IHttpResponse> {
        const modifyParams = {
            path: `/1/RecurrentPayment/${params.paymentId}/Amount`,
            data: (params.amount * 100).toString(),
        };
        return this.modify<IHttpResponse>(modifyParams);
    }

    public modifyNextPaymentDate(
        params: RecurrentModifyNextPaymentDateModel,
    ): Promise<IHttpResponse> {
        const modifyParams = {
            path: `/1/RecurrentPayment/${params.paymentId}/NextPaymentDate`,
            data: params.nextPaymentDate,
        };
        return this.modify<IHttpResponse>(modifyParams);
    }

    public modifyPayment(
        params: RecurrentModifyPaymentModel,
    ): Promise<IHttpResponse> {
        const modifyParams = {
            path: `/1/RecurrentPayment/${params.paymentId}/Payment`,
            data: params.payment,
        };
        return this.modify<IHttpResponse>(modifyParams);
    }

    public deactivate(params: RecurrentModifyModel): Promise<IHttpResponse> {
        const modifyParams = {
            path: `/1/RecurrentPayment/${params.paymentId}/Deactivate`,
            data: "",
        };
        return this.modify<IHttpResponse>(modifyParams);
    }

    public reactivate(params: RecurrentModifyModel): Promise<IHttpResponse> {
        const modifyParams = {
            path: `/1/RecurrentPayment/${params.paymentId}/Reactivate`,
            data: "",
        };
        return this.modify<IHttpResponse>(modifyParams);
    }

    private async modify<T>(options: {
        path: string;
        data: string | CustomerModel | PaymentRecurrentModifyModel | number;
    }): Promise<T> {
        const params = {
            path: options.path,
        };
        console.log("Recurrent Modify Params:", params, "Data:", options.data);

        return await this.httpClient.put(params, options.data);
    }
}
