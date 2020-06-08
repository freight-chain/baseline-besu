/// <reference types="node" />
import { Stream } from 'stream';
import { AS2MimeNode } from '../AS2MimeNode';
/** Class for parsing a MIME document to an AS2MimeNode tree. */
export declare class AS2Parser {
    private static isStream;
    private static streamToBuffer;
    private static transformParsedHeaders;
    private static transformNodeLike;
    static parse(content: Buffer | Stream | string): Promise<AS2MimeNode>;
}
