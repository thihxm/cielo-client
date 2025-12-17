import type { EnumRecurrentPaymentInterval } from "../../enums.js";

export interface RecurrentPaymentModel {
    authorizeNow?: boolean;
    startDate?: string;
    endDate?: string;
    interval?: EnumRecurrentPaymentInterval;
    [x: string]: any;
}
