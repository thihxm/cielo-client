import type { EnumRecurrentPaymentUpdateInterval } from "../../enums.js";
import type { RecurrentModifyModel } from "./recurrent-modify.model.js";

export interface RecurrentModifyIntervalModel extends RecurrentModifyModel {
    interval: EnumRecurrentPaymentUpdateInterval;
}
