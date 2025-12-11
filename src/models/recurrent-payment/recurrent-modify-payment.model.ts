import type { RecurrentModifyModel } from "./recurrent-modify.model";
import type { PaymentRecurrentModifyModel } from "../payment-recurrent-modify.model";

export interface RecurrentModifyPaymentModel extends RecurrentModifyModel {
    payment: PaymentRecurrentModifyModel;
}
