import type { Link } from "../link-model.js";
import type { RecurrentTransaction } from "../recurrent-trasaction.model.js";

export interface RecurrentSearchRecurrentPaymentSearchResponseModel {
    recurrentPaymentId: string;
    nextRecurrency: string;
    startDate: string;
    endDate: string;
    interval: string;
    amount: number;
    country: string;
    createDate: Date;
    currency: string;
    currentRecurrencyTry: number;
    provider: string;
    recurrencyDay: number;
    successfulRecurrences: number;
    links: Link[];
    recurrentTransactions: RecurrentTransaction[];
    status: number;
}
