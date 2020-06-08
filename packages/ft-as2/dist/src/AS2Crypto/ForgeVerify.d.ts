import * as forge from 'node-forge';
export declare function verify(verifier: {
    detached?: string | forge.util.ByteBuffer;
    certificate: string | forge.pki.Certificate;
}): boolean;
