import type { RecurrentModifyModel } from "./recurrent-modify.model";
import type { EnumRecurrentPaymentUpdateInterval } from "../../enums";

export interface RecurrentModifyIntervalModel extends RecurrentModifyModel {
    interval: EnumRecurrentPaymentUpdateInterval;
}
