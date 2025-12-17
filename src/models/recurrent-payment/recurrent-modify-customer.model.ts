import type { CustomerModel } from "../customer.model.js";
import type { RecurrentModifyModel } from "./recurrent-modify.model.js";

export interface RecurrentModifyCustomerModel extends RecurrentModifyModel {
    customer: CustomerModel;
}
