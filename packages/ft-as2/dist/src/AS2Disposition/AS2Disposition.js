"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AS2Disposition = void 0;
const Helpers_1 = require("../Helpers");
const getReportNode = function getReportNode(node) {
  if (!node) return;
  if (
    node.contentType.includes("multipart/report") &&
    node.contentType.includes("disposition-notification")
  ) {
    return node;
  } else {
    for (const childNode of node.childNodes || []) {
      return getReportNode(childNode);
    }
  }
};
const toNotificationValue = function toNotificationValue(value) {
  const result = {};
  const mic = /([A-Za-z0-9+\/=]+),\s*(.+)/gu;
  const parts = value.split(/;/gu).map((part) => part.trim());
  if (
    parts[0].toLowerCase() === "rfc822" ||
    parts[0].toLowerCase() === "unknown"
  ) {
    result.value = parts.slice(1).join("; ");
    result.type = parts[0];
  } else if (parts[0].toLowerCase().includes("automatic-action")) {
    const [type, action] = parts[0].split("/");
    result.value = action;
    result.type = type;
    for (const part of parts.slice(1)) {
      if (result.attributes === undefined) result.attributes = {};
      let index = part.indexOf("=");
      if (index === -1) index = part.length;
      let key = part.slice(0, index).trim();
      let value = part.slice(index + 1).trim();
      if (key.includes("processed")) {
        let [attrKey, attrProp] = key.split("/");
        key = attrKey;
        if (attrProp !== undefined) {
          value = { [attrProp]: value || true };
        }
      }
      if (result.attributes[key] === undefined) {
        result.attributes[key] = value || true;
      }
    }
  } else if (mic.test(value)) {
    const [micValue, type] = value.split(",").map((val) => val.trim());
    result.value = micValue;
    result.type = type;
  } else {
    result.value = parts[0];
    result.type = parts[0].split("/")[0];
    if (result.value === result.type) delete result.type;
    for (const part of parts.slice(1)) {
      if (result.attributes === undefined) result.attributes = {};
      let index = part.indexOf("=");
      if (index === -1) index = part.length;
      const key = part.slice(0, index).trim();
      const value = part.slice(index + 1).trim();
      result.attributes[key] = value || true;
    }
  }
  result.original = value;
  return result;
};
/** Class for describing and constructing a Message Disposition Notification. */
class AS2Disposition {
  constructor(mdn) {
    let messageId;
    // Always get the Message ID of the root node; enveloped MDNs may not have
    // this value on child nodes.
    if (mdn) messageId = mdn.messageId();
    // Travel mime node tree for content type multipart/report.
    mdn = getReportNode(mdn);
    // https://tools.ietf.org/html/rfc3462
    if (mdn) {
      this.messageId = messageId;
      // Get the human-readable message, the first part of the report.
      this.explanation = mdn.childNodes[0].content.toString("utf8").trim();
      // Get the message/disposition-notification and parse, which is the second
      // part.
      this.notification = Helpers_1.parseHeaderString(
        mdn.childNodes[1].content.toString("utf8"),
        true,
        toNotificationValue
      );
      // Get the optional thid part, if present; it is the returned message
      // content.
      this.returned = mdn.childNodes[2];
    }
  }
}
exports.AS2Disposition = AS2Disposition;
