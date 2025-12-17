import camelcaseKeys, { type ObjectLike } from "camelcase-keys";
import * as winston from "winston";

import type { CieloHttpClientOptions } from "../interface/cielo-options.interface.js";

export class HttpClient {
    private logger: winston.Logger;

    constructor(private cieloOptions: CieloHttpClientOptions) {
        this.logger = winston.createLogger({
            level: "debug",
            format: winston.format.json(),
            defaultMeta: { service: "http-client" },
            transports: [new winston.transports.Console({ level: "debug" })],
        });
    }

    public get<T>(params: { path: string }): Promise<T> {
        const { path } = params;

        const url = `https://${this.cieloOptions.queryURL}${path}`;

        return this.request<T>(url, undefined, {
            method: HttpRequestMethodEnum.GET,
        });
    }

    public post<T, U>(params: { path: string }, data: U): Promise<T> {
        const { path } = params;

        const url = `https://${this.cieloOptions.transactionalURL}${path}`;

        return this.request<T>(url, data, {
            method: HttpRequestMethodEnum.POST,
        });
    }

    public put<T, U>(params: { path: string }, data: U): Promise<T> {
        const { path } = params;

        const url = `https://${this.cieloOptions.transactionalURL}${path}`;

        return this.request<T>(url, data, {
            method: HttpRequestMethodEnum.PUT,
        });
    }

    public postToSales<T, U>(data: U): Promise<T> {
        return this.post<T, U>({ path: "/1/sales/" }, data);
    }

    private async request<T>(
        url: string,
        data?: unknown,
        options: RequestOptions = {},
    ): Promise<T> {
        const response = await this.httpRequest(url, data, options);
        return (response?.data ?? response) as T;
    }

    private async httpRequest(
        url: string,
        data?: unknown,
        { headers: customHeaders, ...options }: RequestOptions = {},
    ): Promise<IHttpResponse> {
        let dataPost: string | null = null;
        if (
            typeof data !== "undefined" &&
            data !== null &&
            options.method !== HttpRequestMethodEnum.GET
        ) {
            // Normalize data to remove special characters
            dataPost = JSON.stringify(data)
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
        }

        if (this.cieloOptions.debug) {
            this.logger.debug({
                message: "HTTP Request",
                url,
                method: options.method,
                data: dataPost,
            });
        }

        const headers = {
            ...customHeaders,
            MerchantId: this.cieloOptions.merchantId,
            MerchantKey: this.cieloOptions.merchantKey,
            RequestId: this.cieloOptions.requestId || "",
            "Content-Type": "application/json",
        };

        const res = await fetch(url, {
            ...options,
            headers,
            body: dataPost,
        });

        const responseData = await this.parseResponseData(res);

        if (this.cieloOptions.debug) {
            this.logger.debug({
                message: "HTTP Response",
                url,
                method: options.method,
                status: res.status,
                data: responseData,
            });
        }

        if (![200, 201].includes(res.status)) {
            throw this.parseHttpRequestError(dataPost, res, responseData);
        }

        const response = {
            status: res.status || 0,
            statusText: res.statusText || "",
        };

        if (options.method === "PUT" && !responseData) {
            return response;
        }

        return {
            ...response,
            data: camelcaseKeys(responseData, { deep: true }),
        };
    }

    private async parseResponseData(res: Response): Promise<ObjectLike> {
        let responseData: any = "";
        const textResponse = await res.text();

        if (textResponse && textResponse.length > 0) {
            try {
                responseData = JSON.parse(textResponse);
            } catch (e) {
                responseData = textResponse;
            }
        }
        return responseData;
    }

    private parseHttpRequestError(
        requestData: string | null,
        response: Response,
        responseData: unknown,
    ): CieloHttpError {
        const code =
            (Array.isArray(responseData) && responseData[0]?.Code) || "";
        const message =
            (Array.isArray(responseData) && responseData[0]?.Message) || "";

        throw new CieloHttpError(
            response.status,
            response.statusText,
            {
                url: response.url,
                data: requestData,
            },
            {
                raw: responseData,
                code,
                message,
            },
        );
    }
}

export enum HttpRequestMethodEnum {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
}

type RequestOptions = Omit<RequestInit, "body">;

/**
 * Interface com dados que serão retornados em todas as requisições
 */
export interface IHttpResponse {
    status: number;
    statusText: string;
    data?: unknown;
}

export class CieloHttpError extends Error {
    constructor(
        public readonly status: number,
        public readonly statusText: string,
        public readonly request: {
            url: string;
            data?: string | null;
        },
        public readonly data: {
            raw?: unknown;
            code?: string;
            message?: string;
        },
    ) {
        super(`HTTP ${status} ${statusText} - ${request.url}`);

        this.name = "HttpError";

        Object.setPrototypeOf(this, CieloHttpError.prototype);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CieloHttpError);
        }
    }
}
