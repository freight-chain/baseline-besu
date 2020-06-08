import { AS2MimeNode } from '../AS2MimeNode';
import { AS2DispositionNotification } from './Interfaces';
/** Class for describing and constructing a Message Disposition Notification. */
export declare class AS2Disposition {
    constructor(mdn?: AS2MimeNode);
    messageId: string;
    explanation: string;
    notification: AS2DispositionNotification;
    returned?: AS2MimeNode;
}
