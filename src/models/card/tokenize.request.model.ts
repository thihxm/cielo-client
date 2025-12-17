import type { EnumBrands } from "../../enums.js";

export interface TokenizeRequestModel {
    customerName: string;
    cardNumber: string;
    holder: string;
    expirationDate: string;
    brand: EnumBrands;
    [x: string]: any;
}
