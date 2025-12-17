import { beforeAll, describe, expect, it } from "vitest";
import type { SearchBinResponseModel } from "../src/index.js";
import { Cielo, type CieloConstructor } from "./../src/cielo.js";
import type { SearchBinRequestModel } from "./../src/models/search/search-bin.request.model.js";

const cieloParams: CieloConstructor = {
    merchantId: "8937bd5b-9796-494d-9fe5-f76b3e4da633",
    merchantKey: "XKGHUBSBKIRXKAVPSKWLVXYCLVJUGTNZLIHPUSYV",
    sandbox: true,
};
const cielo = new Cielo(cieloParams);

const BEFORE_ALL_TIMEOUT = 60 * 1000; // 60 seconds

describe("BIN number test", () => {
    let cardBin: SearchBinResponseModel;

    beforeAll(async () => {
        const checkCardBinParams: SearchBinRequestModel = {
            cardBin: "453211",
        };
        cardBin = await cielo.search.bin(checkCardBinParams);
    }, BEFORE_ALL_TIMEOUT);

    it(`Should be a foreign card`, async () => {
        if (cardBin) {
            expect(cardBin.foreignCard).toBe(true);
        }
    });
});
