import { AS2Encryption, AS2Signing } from './AS2Crypto';
export declare const NOT_IMPLEMENTED: Error;
export declare const CRLF = "\r\n";
export declare const MIME_VERSION = "1.0";
export declare const AS2_VERSION = "1.0";
export declare const SMIME_DESC = "This is an S/MIME signed message";
export declare const SIGNATURE_FILENAME = "smime.p7s";
export declare const ENCRYPTION_FILENAME = "smime.p7m";
export declare const SIGNATURE_HEADER: string;
export declare const SIGNATURE_FOOTER: string;
export declare const GUARANTEED_TEXT: string[];
export declare const MULTIPART_TYPE: {
    MIXED: string;
    SIGNED: string;
    ENCRYPTED: string;
};
export declare const PROTOCOL_TYPE: {
    PKCS7: MimeType;
};
export declare const ENCODING: {
    _8BIT: AS2Encoding;
    BASE64: AS2Encoding;
    BINARY: AS2Encoding;
    BIT8: AS2Encoding;
};
export declare const SIGNING: {
    SHA1: AS2Signing;
    SHA256: AS2Signing;
    SHA384: AS2Signing;
    SHA512: AS2Signing;
};
export declare const MICALG: {
    SHA1: string;
    SHA256: string;
    SHA384: string;
    SHA512: string;
};
export declare const ENCRYPTION: {
    _3DES: AS2Encryption;
    AES128: AS2Encryption;
    AES192: AS2Encryption;
    AES256: AS2Encryption;
    DES3: AS2Encryption;
};
export declare const RECEIPT: {
    NONE: AS2Receipt;
    SEND: AS2Receipt;
    SEND_SIGNED: AS2Receipt;
};
export declare const STANDARD_HEADER: {
    VERSION: string;
    TO: string;
    FROM: string;
    MDN_TO: string;
    MDN_OPTIONS: string;
    MDN_URL: string;
};
export declare type AS2Encoding = '8bit' | 'binary' | 'base64';
export declare type AS2Receipt = 0 | 1 | 2;
export declare type MimeType = 'text/plain' | 'application/edi-x12' | 'application/EDI-X12' | 'application/edifact' | 'application/EDIFACT' | 'application/edi-consent' | 'application/EDI-Consent' | 'application/pkcs7-signature' | 'application/pkcs7-mime' | 'application/x-pkcs7-signature' | 'application/x-pkcs7-mime' | 'application/xml' | 'application/XML' | 'message/disposition-notification' | 'multipart/mixed' | 'multipart/report' | 'multipart/signed';
export interface OldAS2Headers {
    'AS2-Version'?: '1.0';
    'as2-version'?: '1.0';
    'AS2-From'?: string;
    'as2-from'?: string;
    'AS2-To'?: string;
    'as2-to'?: string;
    'Content-Type'?: string;
    'content-type'?: string;
    'Content-Disposition'?: string;
    'content-disposition'?: string;
    'Content-Transfer-Encoding'?: '8bit' | 'binary' | 'base64';
    'content-transfer-encoding'?: '8bit' | 'binary' | 'base64';
    Date?: string;
    date?: string;
    'Disposition-Notification-Options'?: string;
    'disposition-notification-options'?: string;
    'Disposition-Notification-To'?: string;
    'disposition-notification-to'?: string;
    'Message-ID'?: string;
    'message-id'?: string;
    'MIME-Version'?: '1.0';
    'mime-version'?: '1.0';
    'Original-Message-Id'?: string;
    'original-message-id'?: string;
    'Receipt-Delivery-Option'?: string;
    'receipt-delivery-option'?: string;
    Subject?: string;
    subject?: string;
}
