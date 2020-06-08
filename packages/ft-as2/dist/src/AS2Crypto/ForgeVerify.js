"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = void 0;
const forge = require("node-forge");
const Helpers_1 = require("../Helpers");
const attributeValidator = {
    name: 'AuthenticatedAttribute',
    tagClass: forge.asn1.Class.UNIVERSAL,
    type: forge.asn1.Type.SEQUENCE,
    constructed: true,
    value: [
        {
            name: 'AuthenticatedAttribute.type',
            tagClass: forge.asn1.Class.UNIVERSAL,
            type: forge.asn1.Type.OID,
            constructed: false,
            capture: 'type'
        },
        {
            name: 'AuthenticatedAttribute.value',
            tagClass: forge.asn1.Class.UNIVERSAL,
            type: forge.asn1.Type.SET,
            constructed: true,
            capture: 'value'
        }
    ]
};
const signerValidator = {
    name: 'SignerInfo',
    tagClass: forge.asn1.Class.UNIVERSAL,
    type: forge.asn1.Type.SEQUENCE,
    constructed: true,
    value: [
        {
            name: 'SignerInfo.version',
            tagClass: forge.asn1.Class.UNIVERSAL,
            type: forge.asn1.Type.INTEGER,
            constructed: false
        },
        {
            name: 'SignerInfo.issuerAndSerialNumber',
            tagClass: forge.asn1.Class.UNIVERSAL,
            type: forge.asn1.Type.SEQUENCE,
            constructed: true,
            value: [
                {
                    name: 'SignerInfo.issuerAndSerialNumber.issuer',
                    tagClass: forge.asn1.Class.UNIVERSAL,
                    type: forge.asn1.Type.SEQUENCE,
                    constructed: true,
                    captureAsn1: 'issuer'
                },
                {
                    name: 'SignerInfo.issuerAndSerialNumber.serialNumber',
                    tagClass: forge.asn1.Class.UNIVERSAL,
                    type: forge.asn1.Type.INTEGER,
                    constructed: false,
                    capture: 'serial'
                }
            ]
        },
        {
            name: 'SignerInfo.digestAlgorithm',
            tagClass: forge.asn1.Class.UNIVERSAL,
            type: forge.asn1.Type.SEQUENCE,
            constructed: true,
            value: [
                {
                    name: 'SignerInfo.digestAlgorithm.algorithm',
                    tagClass: forge.asn1.Class.UNIVERSAL,
                    type: forge.asn1.Type.OID,
                    constructed: false,
                    capture: 'digestAlgorithm'
                },
                {
                    name: 'SignerInfo.digestAlgorithm.parameter',
                    tagClass: forge.asn1.Class.UNIVERSAL,
                    constructed: false,
                    captureAsn1: 'digestParameter',
                    optional: true
                }
            ]
        },
        {
            name: 'SignerInfo.authenticatedAttributes',
            tagClass: forge.asn1.Class.CONTEXT_SPECIFIC,
            type: forge.asn1.Type.NONE,
            constructed: true,
            optional: true,
            capture: 'authenticatedAttributes'
        },
        {
            name: 'SignerInfo.digestEncryptionAlgorithm',
            tagClass: forge.asn1.Class.UNIVERSAL,
            type: forge.asn1.Type.SEQUENCE,
            constructed: true,
            capture: 'signatureAlgorithm'
        },
        {
            name: 'SignerInfo.encryptedDigest',
            tagClass: forge.asn1.Class.UNIVERSAL,
            type: forge.asn1.Type.OCTETSTRING,
            constructed: false,
            capture: 'signature'
        },
        {
            name: 'SignerInfo.unauthenticatedAttributes',
            tagClass: forge.asn1.Class.CONTEXT_SPECIFIC,
            type: forge.asn1.Type.BOOLEAN,
            constructed: true,
            optional: true,
            capture: 'unauthenticatedAttributes'
        }
    ]
};
const messageDigestValidator = {
    name: 'MessageDigest',
    tagClass: forge.asn1.Class.UNIVERSAL,
    type: forge.asn1.Type.OCTETSTRING,
    constructed: false,
    capture: 'messageDigest'
};
function findCertificate(cert, msg) {
    var sAttr = cert.issuer.attributes;
    for (var i = 0; i < msg.certificates.length; ++i) {
        var r = msg.certificates[i];
        var rAttr = r.issuer.attributes;
        if (r.serialNumber !== cert.serialNumber) {
            continue;
        }
        if (rAttr.length !== sAttr.length) {
            continue;
        }
        var match = true;
        for (var j = 0; j < sAttr.length; ++j) {
            if (rAttr[j].type !== sAttr[j].type ||
                rAttr[j].value !== sAttr[j].value) {
                match = false;
                break;
            }
        }
        if (match) {
            return r;
        }
    }
    return null;
}
function findSignerInfo(cert, signerInfos) {
    const sAttr = cert.issuer.attributes;
    for (let i = 0; i < signerInfos.length; ++i) {
        const signerInfo = {};
        forge.asn1.validate(signerInfos[i], signerValidator, signerInfo);
        signerInfo.issuer = forge.pki.RDNAttributesAsArray(signerInfo.issuer);
        signerInfo.serialNumber = forge.util.createBuffer(signerInfo.serial).toHex();
        const rAttr = signerInfo.issuer;
        if (signerInfo.serialNumber !== cert.serialNumber) {
            continue;
        }
        if (rAttr.length !== sAttr.length) {
            continue;
        }
        let match = true;
        for (let j = 0; j < sAttr.length; ++j) {
            if (rAttr[j].type !== sAttr[j].type ||
                rAttr[j].value !== sAttr[j].value) {
                match = false;
                break;
            }
        }
        if (match) {
            return signerInfo;
        }
    }
    return null;
}
function messageDigestFromAsn1(attrs) {
    const capture = {};
    for (let i = 0; i < attrs.length; i += 1) {
        const attr = {};
        forge.asn1.validate(attrs[i], attributeValidator, attr);
        const oid = forge.asn1.derToOid(attr.type);
        if (oid === forge.pki.oids.messageDigest) {
            ;
            forge.asn1.validate(attr.value[0], messageDigestValidator, capture);
            break;
        }
    }
    return capture;
}
// Make sure to bind() to signature for "this".
function verify(verifier) {
    const msg = this;
    let verified = false;
    let cert;
    let content;
    let publicKey;
    let signedAttributes;
    if (typeof verifier.certificate === 'string') {
        cert = forge.pki.certificateFromPem(verifier.certificate);
    }
    else {
        cert = verifier.certificate;
    }
    const recipient = findCertificate(cert, msg);
    if (Helpers_1.isNullOrUndefined(recipient)) {
        throw new Error('Certificate provided was not used to sign message; no matching signature certificate.');
    }
    // If recipient was found but does not have a public key, use the provided certificate.
    publicKey = recipient.publicKey || cert.publicKey;
    if (Helpers_1.isNullOrUndefined(publicKey)) {
        throw new Error('Public key not found in either the signature certificate or provided certificate.');
    }
    content = verifier.detached || msg.content;
    if (msg.content instanceof forge.util.ByteBuffer) {
        content = content.bytes();
    }
    else if (typeof content === 'string') {
        content = forge.util.encodeUtf8(content);
    }
    const contentAsn1 = forge.asn1.create(forge.asn1.Class.UNIVERSAL, forge.asn1.Type.OCTETSTRING, false, content);
    let contentDer = forge.asn1.toDer(contentAsn1);
    // skip identifier and length per RFC 2315 9.3
    // skip identifier (1 byte)
    contentDer.getByte();
    forge.asn1.getBerValueLength(contentDer);
    // Find the signer info by cert issuer and capture signature, algorithm, and signed attributes from signer info.
    const { authenticatedAttributes, digestAlgorithm, signature } = findSignerInfo(cert, msg.rawCapture.signerInfos);
    const algorithm = forge.asn1.derToOid(digestAlgorithm);
    const contentMessageDigest = forge.md[forge.pki.oids[algorithm]].create();
    if (authenticatedAttributes) {
        signedAttributes = authenticatedAttributes;
    }
    else {
        signedAttributes = [];
    }
    ;
    contentMessageDigest.start().update(contentDer.getBytes());
    if (signedAttributes.length > 0) {
        const { messageDigest } = messageDigestFromAsn1(signedAttributes);
        // RFC 5652 requires the contents to match the message digest in the signed attributes.
        if (contentMessageDigest.digest().getBytes() === messageDigest) {
            // Compute message digest of signed attributes and verify with signature.
            const signedAttrMessageDigest = forge.md[forge.pki.oids[algorithm]].create();
            // Per RFC 2315, attributes are to be digested using a SET container
            const attrsAsn1 = forge.asn1.create(forge.asn1.Class.UNIVERSAL, forge.asn1.Type.SET, true, signedAttributes);
            signedAttrMessageDigest
                .start()
                .update(forge.asn1.toDer(attrsAsn1).getBytes());
            verified = publicKey.verify(signedAttrMessageDigest.digest().getBytes(), signature, 'RSASSA-PKCS1-V1_5');
        }
    }
    else {
        // Verify the computed message digest of contents with the signature.
        verified = publicKey.verify(contentMessageDigest.digest().getBytes(), signature, 'RSASSA-PKCS1-V1_5');
    }
    return verified;
}
exports.verify = verify;
