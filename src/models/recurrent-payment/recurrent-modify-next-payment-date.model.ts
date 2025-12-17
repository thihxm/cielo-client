import type { RecurrentModifyModel } from "./recurrent-modify.model.js";

export interface RecurrentModifyNextPaymentDateModel
    extends RecurrentModifyModel {
    nextPaymentDate: string;
}
