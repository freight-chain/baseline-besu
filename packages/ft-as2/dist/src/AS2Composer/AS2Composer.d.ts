import { AS2ComposerOptions, AgreementOptions } from './Interfaces';
import { AS2MimeNodeOptions, AS2MimeNode } from '../AS2MimeNode';
import { AS2Headers, RequestOptions } from '../Interfaces';
/** Class for composing AS2 messages. */
export declare class AS2Composer {
    constructor(options: AS2ComposerOptions);
    _agreement: AgreementOptions;
    _message: AS2MimeNodeOptions;
    _headers: Array<{
        key: string;
        value: string;
    }>;
    message: AS2MimeNode;
    setAgreement(agreement: AgreementOptions): void;
    setHeaders(headers: AS2Headers | AgreementOptions): void;
    compile(): Promise<AS2MimeNode>;
    toRequestOptions(url: string): Promise<RequestOptions>;
}
