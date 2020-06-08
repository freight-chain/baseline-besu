"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STANDARD_HEADER = exports.RECEIPT = exports.ENCRYPTION = exports.MICALG = exports.SIGNING = exports.ENCODING = exports.PROTOCOL_TYPE = exports.MULTIPART_TYPE = exports.GUARANTEED_TEXT = exports.SIGNATURE_FOOTER = exports.SIGNATURE_HEADER = exports.ENCRYPTION_FILENAME = exports.SIGNATURE_FILENAME = exports.SMIME_DESC = exports.AS2_VERSION = exports.MIME_VERSION = exports.CRLF = exports.NOT_IMPLEMENTED = void 0;
exports.NOT_IMPLEMENTED = new Error('NOT YET IMPLEMENTED.');
// STRINGS
exports.CRLF = '\r\n';
exports.MIME_VERSION = '1.0';
exports.AS2_VERSION = '1.0';
exports.SMIME_DESC = 'This is an S/MIME signed message';
exports.SIGNATURE_FILENAME = 'smime.p7s';
exports.ENCRYPTION_FILENAME = 'smime.p7m';
exports.SIGNATURE_HEADER = `-----BEGIN PKCS7-----${exports.CRLF}`;
exports.SIGNATURE_FOOTER = `-----END PKCS7-----${exports.CRLF}`;
// ENUMERABLES
exports.GUARANTEED_TEXT = [
    'text/plain',
    'application/edi-x12',
    'application/EDI-X12',
    'application/edifact',
    'application/EDIFACT',
    'application/edi-consent',
    'application/EDI-Consent',
    'application/xml',
    'application/XML'
];
// NAMESPACES
exports.MULTIPART_TYPE = {
    MIXED: 'multipart/mixed',
    SIGNED: 'multipart/signed',
    ENCRYPTED: 'multipart/encrypted'
};
exports.PROTOCOL_TYPE = {
    PKCS7: 'application/x-pkcs7-signature'
};
exports.ENCODING = {
    _8BIT: '8bit',
    BASE64: 'base64',
    BINARY: 'binary',
    BIT8: '8bit'
};
exports.SIGNING = {
    SHA1: 'sha1',
    SHA256: 'sha256',
    SHA384: 'sha384',
    SHA512: 'sha512'
};
exports.MICALG = {
    SHA1: 'sha1',
    SHA256: 'sha-256',
    SHA384: 'sha-384',
    SHA512: 'sha-512'
};
exports.ENCRYPTION = {
    _3DES: 'des-EDE3-CBC',
    AES128: 'aes128-CBC',
    AES192: 'aes192-CBC',
    AES256: 'aes256-CBC',
    DES3: 'des-EDE3-CBC'
};
exports.RECEIPT = {
    NONE: 0,
    SEND: 1,
    SEND_SIGNED: 2
};
exports.STANDARD_HEADER = {
    VERSION: 'AS2-Version',
    TO: 'AS2-To',
    FROM: 'AS2-From',
    MDN_TO: 'Disposition-Notification-To',
    MDN_OPTIONS: 'Disposition-Notification-Options',
    MDN_URL: 'Receipt-Delivery-Option'
};
