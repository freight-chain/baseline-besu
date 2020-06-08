"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AS2Parser = void 0;
const stream_1 = require("stream");
const AS2MimeNode_1 = require("../AS2MimeNode");
// @ts-ignore
const emailjs_mime_parser_1 = require("@nhs-llc/emailjs-mime-parser");
/** Class for parsing a MIME document to an AS2MimeNode tree. */
class AS2Parser {
    static isStream(stream) {
        return stream instanceof stream_1.Stream || typeof stream.on === 'function';
    }
    static async streamToBuffer(stream) {
        return new Promise((resolve, reject) => {
            try {
                const chunks = [];
                stream.on('data', chunk => chunks.push(chunk));
                stream.on('error', error => reject(error));
                stream.on('end', () => resolve(Buffer.concat(chunks)));
            }
            catch (error) {
                reject(error);
            }
        });
    }
    static transformParsedHeaders(headerObj) {
        const headers = [];
        for (const [key, value] of Object.entries(headerObj)) {
            for (const obj of value) {
                headers.push({
                    key: key,
                    value: obj.initial
                });
            }
        }
        return headers;
    }
    static transformNodeLike(nodeLike, rootNode, parentNode) {
        const currentNode = new AS2MimeNode_1.AS2MimeNode({
            filename: nodeLike.headers['content-disposition'] !== undefined
                ? nodeLike.headers['content-disposition'][0].params.filename
                : undefined,
            contentType: nodeLike.contentType.initial,
            headers: this.transformParsedHeaders(nodeLike.headers),
            content: nodeLike.content === undefined || this.isStream(nodeLike.content)
                ? nodeLike.content
                : Buffer.from(nodeLike.content),
            baseBoundary: nodeLike._multipartBoundary === false
                ? undefined
                : nodeLike._multipartBoundary,
            boundaryPrefix: ''
        });
        if (!rootNode)
            rootNode = currentNode;
        currentNode.rootNode = rootNode;
        currentNode.parentNode = parentNode;
        currentNode.nodeCounter =
            typeof nodeLike.nodeCounter === 'object'
                ? nodeLike.nodeCounter.count
                : nodeLike.nodeCounter;
        currentNode.parsed = true;
        currentNode.raw = nodeLike.raw;
        if (Array.isArray(nodeLike.childNodes)) {
            for (const childNode of nodeLike.childNodes) {
                const as2Node = this.transformNodeLike(childNode, rootNode, currentNode);
                currentNode.childNodes.push(as2Node);
            }
        }
        return currentNode;
    }
    static async parse(content) {
        if (this.isStream(content))
            content = await this.streamToBuffer(content);
        const result = emailjs_mime_parser_1.default(content);
        const as2node = this.transformNodeLike(result);
        return as2node;
    }
}
exports.AS2Parser = AS2Parser;
