"use strict";
Object.defineProperty(exports, "__esModule", {value : true});
exports.AS2Composer = void 0;
const AS2MimeNode_1 = require("../AS2MimeNode");
const Helpers_1 = require("../Helpers");
const Constants_1 = require("../Constants");
/** Class for composing AS2 messages. */
class AS2Composer {
  constructor(options) {
    this._message = Object.assign({}, options.message);
    this._headers = [];
    this.setAgreement(options.agreement);
    this.setHeaders(this._agreement);
  }
  setAgreement(agreement) {
    this._agreement = Helpers_1.agreementOptions(agreement);
  }
  setHeaders(headers) {
    if (!Helpers_1.isNullOrUndefined(headers.sender) &&
        !Helpers_1.isNullOrUndefined(headers.recipient)) {
      const result = [];
      for (let entry of Object.entries(headers)) {
        const [key, value] = entry;
        switch (key) {
        case "sender":
          result.push({key : Constants_1.STANDARD_HEADER.FROM, value});
          break;
        case "recipient":
          result.push({key : Constants_1.STANDARD_HEADER.TO, value});
          break;
        case "version":
          result.push({key : Constants_1.STANDARD_HEADER.VERSION, value});
          break;
        case "mdn":
          const mdn = value;
          result.push({
            key : Constants_1.STANDARD_HEADER.MDN_TO,
            value : mdn.to,
          });
          if (!Helpers_1.isNullOrUndefined(mdn.sign)) {
            const sign = mdn.sign;
            result.push({
              key : Constants_1.STANDARD_HEADER.MDN_OPTIONS,
              value : `signed-receipt-protocol=${sign.importance},${
                  sign.protocol}; signed-receipt-micalg=${sign.importance},${
                  sign.micalg}`,
            });
          }
          if (!Helpers_1.isNullOrUndefined(mdn.deliveryUrl)) {
            result.push({
              key : Constants_1.STANDARD_HEADER.MDN_URL,
              value : mdn.deliveryUrl,
            });
          }
          break;
        case "headers":
          this.setHeaders(value);
          break;
        }
      }
      this._headers = this._headers.concat(result);
    } else {
      if (Array.isArray(headers)) {
        this._headers = this._headers.concat(headers);
      } else {
        for (let entry of Object.entries(headers)) {
          for (let [key, value] of entry) {
            this._headers.push({key, value});
          }
        }
      }
    }
  }
  async compile() {
    this.message =
        new AS2MimeNode_1.AS2MimeNode(Object.assign({}, this._message));
    if (!Helpers_1.isNullOrUndefined(this._agreement.sign)) {
      this.message.setSigning(this._agreement.sign);
    }
    if (!Helpers_1.isNullOrUndefined(this._agreement.encrypt)) {
      this.message.setEncryption(this._agreement.encrypt);
    }
    if (!Helpers_1.isNullOrUndefined(this._agreement.sign) ||
        !Helpers_1.isNullOrUndefined(this._message.sign)) {
      this.message = await this.message.sign();
    }
    if (!Helpers_1.isNullOrUndefined(this._agreement.encrypt) ||
        !Helpers_1.isNullOrUndefined(this._message.encrypt)) {
      this.message = await this.message.encrypt();
    }
    this.message.setHeader(this._headers);
    return this.message;
  }
  async toRequestOptions(url) {
    if (this.message === undefined) {
      await this.compile();
    }
    const buffer = await this.message.build();
    const [headers, ...body] =
        buffer.toString("utf8").split(/(\r\n|\n\r|\n)(\r\n|\n\r|\n)/gu);
    return {
      url,
      headers : Helpers_1.parseHeaderString(headers),
      body : body.join("").trimLeft(),
      method : "POST",
    };
  }
}
exports.AS2Composer = AS2Composer;
