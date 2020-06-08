/// <reference types="node" />
import { URL } from 'url';
import { AgreementOptions } from './AS2Composer';
import { AS2MimeNode } from './AS2MimeNode';
import { SigningOptions, EncryptionOptions } from './AS2Crypto';
import { RequestOptions, IncomingMessage } from './Interfaces';
/** Method for converting a string of headers into key:value pairs. */
export declare function parseHeaderString(headers: string): {
    [key: string]: string | string[];
};
export declare function parseHeaderString(headers: string, keyToLowerCase: boolean): {
    [key: string]: string | string[];
};
export declare function parseHeaderString(headers: string, callback: (value: string) => any): {
    [key: string]: any;
};
export declare function parseHeaderString(headers: string, keyToLowerCase: boolean, callback: (value: string) => any): {
    [key: string]: any;
};
export declare function getProtocol(url: string | URL): string;
/** Convenience method for null-checks */
export declare function isNullOrUndefined(value: any): boolean;
export declare function isSMime(value: string): boolean;
/** Transforms a payload into a canonical text format before signing */
export declare function canonicalTransform(node: AS2MimeNode): void;
/** Normalizes certificate signing options. */
export declare function signingOptions(sign: SigningOptions): SigningOptions;
/** Normalizes encryption options. */
export declare function encryptionOptions(encrypt: EncryptionOptions): EncryptionOptions;
/** Normalizes agreement options. */
export declare function agreementOptions(agreement: AgreementOptions): AgreementOptions;
/** Convenience method for making AS2 HTTP/S requests. Makes a POST request by default. */
export declare function request(options: RequestOptions): Promise<IncomingMessage>;
