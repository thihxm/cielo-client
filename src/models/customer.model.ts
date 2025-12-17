import type { AddressModel } from "./address.model.js";

export interface CustomerModel {
    /**
     * 	Nome do Comprador.
     */
    name?: string;
    /**
     * Status de cadastro do comprador na loja (NEW / EXISTING)
     */
    status?: string;
    /**
     * Número do CPF ou CNPJ do Cliente.
     */
    identity?: string;
    /**
     * Tipo de documento de identificação do comprador (CFP/CNPJ).
     */
    identityType?: "CPF" | "CNPJ";
    /**
     * Email do Comprador.
     */
    email?: string;
    /**
     * Data de nascimento do Comprador.
     */
    birthdate?: string;
    /**
     * Endereço do Comprador.
     */
    address?: AddressModel;
    /**
     * Endereço de entraga.
     */
    deliveryAddress?: AddressModel;
    /**
     * Número do telefone
     */
    phone?: string;
    [x: string]: any;
}
