"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = exports.agreementOptions = exports.encryptionOptions = exports.signingOptions = exports.canonicalTransform = exports.isSMime = exports.isNullOrUndefined = exports.getProtocol = exports.parseHeaderString = void 0;
const http = require("http");
const https = require("https");
const url_1 = require("url");
const Constants_1 = require("./Constants");
const AS2Parser_1 = require("./AS2Parser");
function parseHeaderString(headers, keyToLowerCase = false, callback) {
    const result = {};
    if (!headers)
        return result;
    if (typeof keyToLowerCase === 'function') {
        callback = keyToLowerCase;
        keyToLowerCase = false;
    }
    if (!callback)
        callback = (value) => value;
    // Unfold header lines, split on newline, and trim whitespace from strings.
    const lines = headers
        .trim()
        .replace(/(\r\n|\n\r|\n)( |\t)/gu, ' ')
        .split(/\n/gu)
        .map(line => line.trim());
    // Assign one or more values to each header key.
    for (const line of lines) {
        const index = line.indexOf(':');
        let key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim();
        if (keyToLowerCase)
            key = key.toLowerCase();
        if (result[key] === undefined) {
            result[key] = callback(value);
        }
        else if (Array.isArray(result[key])) {
            result[key].push(callback(value));
        }
        else {
            result[key] = [result[key], callback(value)];
        }
    }
    return result;
}
exports.parseHeaderString = parseHeaderString;
function getProtocol(url) {
    if (typeof url === 'string' || url instanceof url_1.URL) {
        return new url_1.URL(url).protocol.replace(':', '');
    }
    throw new Error('URL is not one of either "string" or instance of "URL".');
}
exports.getProtocol = getProtocol;
/** Convenience method for null-checks */
function isNullOrUndefined(value) {
    return value === undefined || value === null;
}
exports.isNullOrUndefined = isNullOrUndefined;
function isSMime(value) {
    return (value.toLowerCase().startsWith('application/pkcs7') ||
        value.toLowerCase().startsWith('application/x-pkcs7'));
}
exports.isSMime = isSMime;
/** Transforms a payload into a canonical text format before signing */
function canonicalTransform(node) {
    const newline = /\r\n|\r|\n/g;
    if (node.getHeader('content-type').slice(0, 5) === 'text/' &&
        !isNullOrUndefined(node.content)) {
        node.content = node.content.replace(newline, '\r\n');
    }
    node.childNodes.forEach(canonicalTransform);
}
exports.canonicalTransform = canonicalTransform;
/** Normalizes certificate signing options. */
function signingOptions(sign) {
    return Object.assign({ cert: '', key: '', chain: [], micalg: Constants_1.SIGNING.SHA256 }, sign);
}
exports.signingOptions = signingOptions;
/** Normalizes encryption options. */
function encryptionOptions(encrypt) {
    return Object.assign({ cert: '', encryption: Constants_1.ENCRYPTION._3DES }, encrypt);
}
exports.encryptionOptions = encryptionOptions;
/** Normalizes agreement options. */
function agreementOptions(agreement) {
    const { mdn } = agreement;
    const { sign } = mdn;
    return Object.assign(Object.assign({ version: '1.0' }, agreement), { mdn: isNullOrUndefined(mdn)
            ? mdn
            : Object.assign(Object.assign({}, mdn), { sign: isNullOrUndefined(sign)
                    ? sign
                    : Object.assign({ importance: 'required', protocol: 'pkcs7-signature' }, sign) }) });
}
exports.agreementOptions = agreementOptions;
/** Convenience method for making AS2 HTTP/S requests. Makes a POST request by default. */
async function request(options) {
    return new Promise((resolve, reject) => {
        try {
            const { params } = options;
            let { body, url } = options;
            url = new url_1.URL(url);
            body = isNullOrUndefined(body) ? '' : body;
            const protocol = getProtocol(url) === 'https' ? https : http;
            delete options.body;
            delete options.url;
            options.method = options.method || 'POST';
            Object.entries(params || {}).forEach(val => url.searchParams.append(...val));
            const responseBufs = [];
            const req = protocol.request(url, options, (response) => {
                const bodyBufs = [];
                response.on('data', (data) => bodyBufs.push(data));
                response.on('error', error => reject(error));
                response.on('end', () => {
                    const rawResponse = Buffer.concat(responseBufs);
                    const rawBody = Buffer.concat(bodyBufs);
                    response.rawBody = rawBody;
                    response.rawResponse = rawResponse;
                    response.mime = () => AS2Parser_1.AS2Parser.parse(rawResponse);
                    response.json = function json() {
                        try {
                            return JSON.parse(rawBody.toString('utf8'));
                        }
                        catch (err) {
                            return err;
                        }
                    };
                    resolve(response);
                });
            });
            req.on('error', error => reject(error));
            req.on('socket', (socket) => {
                socket.on('data', (data) => responseBufs.push(data));
            });
            req.write(body);
            req.end();
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.request = request;
