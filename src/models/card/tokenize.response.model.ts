import type { Link } from "../link-model.js";

export interface TokenizeResponseModel {
    cardToken: string;
    links: Link;
}
