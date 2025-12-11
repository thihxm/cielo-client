import type { RecurrentModifyModel } from "./recurrent-modify.model";
import type { CustomerModel } from "../customer.model";

export interface RecurrentModifyCustomerModel extends RecurrentModifyModel {
    customer: CustomerModel;
}
