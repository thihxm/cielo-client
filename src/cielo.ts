import { BankSlip } from "./class/bank-slip";
import { Card } from "./class/cards";
import { CreditCard } from "./class/creditcard";
import { DebitCard } from "./class/debit-card";
import { HttpClient } from "./class/http-client";
import { PIX } from "./class/pix";
import { Recurrent } from "./class/recurrent";
import { Search } from "./class/search";
import type { CieloHttpClientOptions } from "./interface/cielo-options.interface";

export interface CieloConstructor {
    merchantId: string;
    merchantKey: string;
    debug?: boolean;
    sandbox?: boolean;
    requestId?: string;
}

export class Cielo {
    private merchantId: string;
    private merchantKey: string;
    private debug: boolean;
    private sandbox: boolean;
    private requestId?: string | undefined;

    private utils: HttpClient;

    public creditCard: CreditCard;
    public debitCard: DebitCard;
    public pix: PIX;

    public card: Card;

    public search: Search;

    public recurrent: Recurrent;

    public bankSlip: BankSlip;

    constructor({
        merchantId,
        merchantKey,
        debug = false,
        sandbox = false,
        requestId = undefined,
    }: CieloConstructor) {
        this.merchantId = merchantId;
        this.merchantKey = merchantKey;
        this.debug = debug;
        this.sandbox = sandbox;
        this.requestId = requestId;

        const { transactionalURL, queryURL } = this.getHostnames(this.sandbox);

        const cieloTransactionInterface = {
            transactionalURL,
            queryURL,
            merchantId: this.merchantId,
            merchantKey: this.merchantKey,
            requestId: this.requestId,
            debug: this.debug,
        } satisfies CieloHttpClientOptions;

        this.utils = new HttpClient(cieloTransactionInterface);

        this.creditCard = new CreditCard(this.utils);
        this.debitCard = new DebitCard(this.utils);
        this.pix = new PIX(this.utils);
        this.card = new Card(this.utils);
        this.search = new Search(this.utils);
        this.recurrent = new Recurrent(this.utils);
        this.bankSlip = new BankSlip(this.utils);
    }

    private getHostnames(sandbox: boolean): {
        transactionalURL: string;
        queryURL: string;
    } {
        if (sandbox) {
            return {
                transactionalURL: "apisandbox.cieloecommerce.cielo.com.br",
                queryURL: "apiquerysandbox.cieloecommerce.cielo.com.br",
            };
        } else {
            return {
                transactionalURL: "api.cieloecommerce.cielo.com.br",
                queryURL: "apiquery.cieloecommerce.cielo.com.br",
            };
        }
    }
}
