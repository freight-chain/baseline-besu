/// <reference types="node" />
import { AS2MimeNode } from '../AS2MimeNode';
import { EncryptionOptions, SigningOptions, DecryptionOptions, VerificationOptions } from './Interfaces';
/** Class for cryptography methods supported by AS2. */
export declare class AS2Crypto {
    private static buildNode;
    /** A fix for signing with Nodemailer to produce verifiable SMIME;
     * the library joins multipart boundaries without the part's trailing CRLF,
     * where OpenSSL and other SMIME clients keep each part's last CRLF. */
    static removeTrailingCrLf(buffer: Buffer): Buffer;
    /** Crux to generate UUID-like random strings */
    static generateUniqueId(): string;
    /** Method to decrypt an AS2MimeNode from a PKCS7 encrypted AS2MimeNode. */
    static decrypt(node: AS2MimeNode, options: DecryptionOptions): Promise<AS2MimeNode>;
    /** Method to envelope an AS2MimeNode in an encrypted AS2MimeNode. */
    static encrypt(node: AS2MimeNode, options: EncryptionOptions): Promise<AS2MimeNode>;
    /** Method to verify data has not been modified from a signature. */
    static verify(node: AS2MimeNode, options: VerificationOptions): Promise<boolean>;
    /** Method to sign data against a certificate and key pair. */
    static sign(node: AS2MimeNode, options: SigningOptions): Promise<AS2MimeNode>;
    /** Not yet implemented; do not use.
     * @throws NOT_IMPLEMENTED
    */
    static compress(node: AS2MimeNode, options: any): Promise<AS2MimeNode>;
    /** Not yet implemented.
     * @throws NOT_IMPLEMENTED
    */
    static decompress(node: AS2MimeNode, options: any): Promise<AS2MimeNode>;
}
