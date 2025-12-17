import type { PaymentRecurrentModifyModel } from "../payment-recurrent-modify.model.js";
import type { RecurrentModifyModel } from "./recurrent-modify.model.js";

export interface RecurrentModifyPaymentModel extends RecurrentModifyModel {
    payment: PaymentRecurrentModifyModel;
}
