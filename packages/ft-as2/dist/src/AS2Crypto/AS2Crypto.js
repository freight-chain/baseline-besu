"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AS2Crypto = void 0;
const Constants_1 = require("../Constants");
const forge = require("node-forge");
const AS2MimeNode_1 = require("../AS2MimeNode");
const Helpers_1 = require("../Helpers");
const MimeNode = require("nodemailer/lib/mime-node");
const AS2Parser_1 = require("../AS2Parser");
const crypto_1 = require("crypto");
const ForgeVerify_1 = require("./ForgeVerify");
/** Class for cryptography methods supported by AS2. */
class AS2Crypto {
    static async buildNode(node) {
        return node.parsed
            ? await node.build()
            : await MimeNode.prototype.build.bind(node)();
    }
    /** A fix for signing with Nodemailer to produce verifiable SMIME;
     * the library joins multipart boundaries without the part's trailing CRLF,
     * where OpenSSL and other SMIME clients keep each part's last CRLF. */
    static removeTrailingCrLf(buffer) {
        const trailingBytes = buffer.slice(buffer.length - 2, buffer.length);
        return trailingBytes.toString('utf8') === Constants_1.CRLF
            ? buffer.slice(0, buffer.length - 2)
            : buffer;
    }
    /** Crux to generate UUID-like random strings */
    static generateUniqueId() {
        const byteLengths = [4, 2, 2, 2, 6];
        return byteLengths
            .map(byteLength => crypto_1.randomBytes(byteLength).toString('hex'))
            .join('-');
    }
    /** Method to decrypt an AS2MimeNode from a PKCS7 encrypted AS2MimeNode. */
    static async decrypt(node, options) {
        const data = Buffer.isBuffer(node.content)
            ? node.content
            : Buffer.from(node.content, 'base64');
        const der = forge.util.createBuffer(data);
        const asn1 = forge.asn1.fromDer(der);
        const p7 = forge.pkcs7.messageFromAsn1(asn1);
        const recipient = p7.findRecipient(forge.pki.certificateFromPem(options.cert));
        if (recipient === null) {
            throw new Error('Certificate provided was not used to encrypt message.');
        }
        p7.decrypt(recipient, forge.pki.privateKeyFromPem(options.key));
        // Parse Mime body from p7.content back to AS2MimeNode
        const buffer = Buffer.from(p7.content.getBytes(), 'binary').toString('utf8');
        const revivedNode = await AS2Parser_1.AS2Parser.parse(buffer);
        return revivedNode;
    }
    /** Method to envelope an AS2MimeNode in an encrypted AS2MimeNode. */
    static async encrypt(node, options) {
        options = Helpers_1.encryptionOptions(options);
        const rootNode = new AS2MimeNode_1.AS2MimeNode({
            filename: 'smime.p7m',
            contentType: 'application/pkcs7-mime; smime-type=enveloped-data'
        });
        Helpers_1.canonicalTransform(node);
        const buffer = await AS2Crypto.buildNode(node);
        const p7 = forge.pkcs7.createEnvelopedData();
        p7.addRecipient(forge.pki.certificateFromPem(options.cert));
        p7.content = forge.util.createBuffer(buffer.toString('utf8'));
        p7.encrypt(undefined, forge.pki.oids[options.encryption]);
        const der = forge.asn1.toDer(p7.toAsn1());
        const derBuffer = Buffer.from(der.getBytes(), 'binary');
        rootNode.setContent(derBuffer);
        return rootNode;
    }
    /** Method to verify data has not been modified from a signature. */
    static async verify(node, options) {
        const contentPart = await AS2Crypto.buildNode(node.childNodes[0]);
        const contentBuffer = forge.util.createBuffer(contentPart);
        const contentBufferNoCrLf = forge.util.createBuffer(AS2Crypto.removeTrailingCrLf(contentPart));
        const signaturePart = Buffer.isBuffer(node.childNodes[1].content)
            ? node.childNodes[1].content
            : Buffer.from(node.childNodes[1].content, 'base64');
        const der = forge.util.createBuffer(signaturePart);
        const asn1 = forge.asn1.fromDer(der);
        const msg = forge.pkcs7.messageFromAsn1(asn1);
        const verify = ForgeVerify_1.verify.bind(msg);
        // Deal with Nodemailer trailing CRLF bug by trying with and without CRLF
        const verified = verify({ certificate: options.cert, detached: contentBuffer }) ||
            verify({ certificate: options.cert, detached: contentBufferNoCrLf });
        return verified;
    }
    /** Method to sign data against a certificate and key pair. */
    static async sign(node, options) {
        const rootNode = new AS2MimeNode_1.AS2MimeNode({
            contentType: `multipart/signed; protocol="application/pkcs7-signature"; micalg=${options.micalg};`,
            encrypt: node._encrypt
        });
        const contentNode = rootNode.appendChild(node);
        const contentHeaders = contentNode._headers;
        for (let i = 0, len = contentHeaders.length; i < len; i++) {
            const header = contentHeaders[i];
            if (header.key.toLowerCase() === 'content-type')
                continue;
            rootNode.setHeader(header.key, header.value);
            contentHeaders.splice(i, 1);
            i--;
            len--;
        }
        Helpers_1.canonicalTransform(contentNode);
        const buffer = AS2Crypto.removeTrailingCrLf(await AS2Crypto.buildNode(contentNode));
        const p7 = forge.pkcs7.createSignedData();
        p7.content = forge.util.createBuffer(buffer);
        p7.addCertificate(options.cert);
        p7.addSigner({
            key: options.key,
            certificate: options.cert,
            digestAlgorithm: forge.pki.oids[options.micalg],
            authenticatedAttributes: [
                {
                    type: forge.pki.oids.contentType,
                    value: forge.pki.oids.data
                },
                {
                    type: forge.pki.oids.messageDigest
                },
                {
                    type: forge.pki.oids.signingTime
                }
            ]
        });
        p7.sign({ detached: true });
        // Write PKCS7 ASN.1 as DER to buffer
        const asn1 = p7.toAsn1();
        const der = forge.asn1.toDer(asn1);
        const derBuffer = Buffer.from(der.getBytes(), 'binary');
        rootNode.appendChild(new AS2MimeNode_1.AS2MimeNode({
            filename: 'smime.p7s',
            contentType: 'application/pkcs7-signature',
            content: derBuffer
        }));
        return rootNode;
    }
    /** Not yet implemented; do not use.
     * @throws NOT_IMPLEMENTED
    */
    static async compress(node, options) {
        throw Constants_1.NOT_IMPLEMENTED;
    }
    /** Not yet implemented.
     * @throws NOT_IMPLEMENTED
    */
    static async decompress(node, options) {
        throw Constants_1.NOT_IMPLEMENTED;
    }
}
exports.AS2Crypto = AS2Crypto;
