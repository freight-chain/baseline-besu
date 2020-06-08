"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AS2MimeNode = void 0;
const MimeNode = require("nodemailer/lib/mime-node");
const Helpers_1 = require("../Helpers");
const AS2Crypto_1 = require("../AS2Crypto");
const os_1 = require("os");
/** Class for describing and constructing a MIME document. */
class AS2MimeNode extends MimeNode {
    constructor(options) {
        const { filename, content, baseBoundary, boundaryPrefix, contentType, contentDisposition, messageId, headers, sign, encrypt } = options;
        super(contentType, { filename, baseBoundary });
        this.contentType = contentType;
        this.boundaryPrefix = Helpers_1.isNullOrUndefined(boundaryPrefix)
            ? '--LibAs2'
            : boundaryPrefix === false
                ? ''
                : boundaryPrefix;
        if (!Helpers_1.isNullOrUndefined(content))
            this.setContent(content);
        if (!Helpers_1.isNullOrUndefined(headers))
            this.setHeader(headers);
        if (!Helpers_1.isNullOrUndefined(sign))
            this.setSigning(sign);
        if (!Helpers_1.isNullOrUndefined(encrypt))
            this.setEncryption(encrypt);
        if (!Helpers_1.isNullOrUndefined(messageId))
            this.setHeader('Message-ID', messageId);
        if (!Helpers_1.isNullOrUndefined(contentDisposition) &&
            contentDisposition !== false) {
            this.setHeader('Content-Disposition', contentDisposition === true ? 'attachment' : contentDisposition);
        }
        if (this.contentType) {
            this.signed = contentType.toLowerCase().startsWith('multipart/signed');
            this.encrypted = contentType
                .toLowerCase()
                .startsWith('multipart/encrypted');
            this.smime = Helpers_1.isSMime(contentType);
            this.compressed = false;
            if (this.smime) {
                let applicationType;
                // Check for actual smime-type
                for (let part of contentType.split(/;/gu)) {
                    let [key, value] = part.trim().split(/=/gu);
                    key = key.trim().toLowerCase();
                    if (key === 'smime-type') {
                        this.smimeType = value.trim().toLowerCase();
                    }
                    if (key.startsWith('application/')) {
                        applicationType = key;
                    }
                }
                // Infer smime-type
                if (this.smimeType === undefined || this.smimeType === '') {
                    if (applicationType.endsWith('signature')) {
                        this.smimeType = 'signed-data';
                    }
                    else {
                        this.smimeType = 'not-available';
                    }
                }
                if (this.smimeType === 'signed-data')
                    this.signed = true;
                if (this.smimeType === 'enveloped-data')
                    this.encrypted = true;
                if (this.smimeType === 'compressed-data')
                    this.compressed = true;
            }
        }
        this.parsed = false;
    }
    setSigning(options) {
        this._sign = Helpers_1.signingOptions(options);
    }
    setEncryption(options) {
        this._encrypt = Helpers_1.encryptionOptions(options);
    }
    setHeader(keyOrHeaders, value) {
        return super.setHeader(keyOrHeaders, value);
    }
    messageId(create = false) {
        let messageId = this.getHeader('Message-ID');
        // You really should define your own Message-Id field!
        if (!messageId && create) {
            messageId = AS2MimeNode.generateMessageId();
            this.setHeader('Message-ID', messageId);
        }
        return messageId;
    }
    async sign(options) {
        options = Helpers_1.isNullOrUndefined(options) ? this._sign : options;
        return AS2Crypto_1.AS2Crypto.sign(this, options);
    }
    async verify(options) {
        return (await AS2Crypto_1.AS2Crypto.verify(this, options))
            ? this.childNodes[0]
            : undefined;
    }
    async decrypt(options) {
        return AS2Crypto_1.AS2Crypto.decrypt(this, options);
    }
    async encrypt(options) {
        options = Helpers_1.isNullOrUndefined(options) ? this._encrypt : options;
        return AS2Crypto_1.AS2Crypto.encrypt(this, options);
    }
    async build() {
        if (this.parsed && this.raw !== undefined)
            return Buffer.from(this.raw);
        if (!Helpers_1.isNullOrUndefined(this._sign) && !Helpers_1.isNullOrUndefined(this._encrypt)) {
            const signed = await this.sign(this._sign);
            const encrypted = await signed.encrypt(this._encrypt);
            return await encrypted.build();
        }
        if (!Helpers_1.isNullOrUndefined(this._sign)) {
            const signed = await this.sign(this._sign);
            return await signed.build();
        }
        if (!Helpers_1.isNullOrUndefined(this._encrypt)) {
            const encrypted = await this.encrypt(this._encrypt);
            return await encrypted.build();
        }
        return await super.build();
    }
    static generateMessageId(sender, uniqueId) {
        uniqueId = Helpers_1.isNullOrUndefined(uniqueId)
            ? AS2Crypto_1.AS2Crypto.generateUniqueId()
            : uniqueId;
        sender = Helpers_1.isNullOrUndefined(uniqueId) ? os_1.hostname() || 'localhost' : sender;
        return '<' + uniqueId + '@' + sender + '>';
    }
}
exports.AS2MimeNode = AS2MimeNode;
