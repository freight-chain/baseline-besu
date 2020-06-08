/// <reference types="node" />
import { Readable } from 'stream';
import * as MimeNode from 'nodemailer/lib/mime-node';
import { AS2MimeNodeOptions } from './Interfaces';
import { SigningOptions, EncryptionOptions, DecryptionOptions, VerificationOptions } from '../AS2Crypto';
/** Class for describing and constructing a MIME document. */
export interface AS2MimeNode {
    keepBcc: boolean;
    _headers: Array<{
        key: string;
        value: string;
    }>;
    filename: string;
    date: Date;
    boundaryPrefix: string;
    content: string | Buffer | Readable;
    contentType: string;
    rootNode: AS2MimeNode;
    parentNode?: AS2MimeNode;
    childNodes: AS2MimeNode[];
    nodeCounter: number;
    raw: string;
    normalizeHeaderKey: Function;
    _handleContentType(structured: any): void;
    _encodeWords(value: string): string;
    _encodeHeaderValue(key: string, value: string): string;
}
/** Class for describing and constructing a MIME document. */
export declare class AS2MimeNode extends MimeNode {
    constructor(options: AS2MimeNodeOptions);
    private _sign;
    private _encrypt;
    parsed: boolean;
    smime: boolean;
    signed: boolean;
    encrypted: boolean;
    compressed: boolean;
    smimeType: string;
    setSigning(options: SigningOptions): void;
    setEncryption(options: EncryptionOptions): void;
    setHeader(keyOrHeaders: any, value?: any): this;
    messageId(create?: boolean): string;
    sign(options?: SigningOptions): Promise<AS2MimeNode>;
    verify(options: VerificationOptions): Promise<AS2MimeNode>;
    decrypt(options: DecryptionOptions): Promise<AS2MimeNode>;
    encrypt(options?: EncryptionOptions): Promise<AS2MimeNode>;
    build(): Promise<Buffer>;
    static generateMessageId(sender?: string, uniqueId?: string): string;
}
