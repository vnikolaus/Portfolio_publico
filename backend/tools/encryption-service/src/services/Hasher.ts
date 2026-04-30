import { createCipheriv, createDecipheriv, createHash, randomBytes, scryptSync } from "node:crypto";

const HASH_ALGO_2 = 'sha512';
const AES_ALGO    = 'aes-256-gcm';
const KEY_BYTES   = 32;
const SALT_BYTES  = 16;

export class Hasher {
    static encryptHash(value: string) {
        const hash = createHash(HASH_ALGO_2).update(value).digest('hex');
        return hash;
    }

    static encryptAES(value: string, key: string) {
        const salt       = randomBytes(SALT_BYTES);
        const key32bytes = scryptSync(key, salt, KEY_BYTES);
        const iv         = randomBytes(12); // GCM utiliza 12 bytes
        const cipher     = createCipheriv(AES_ALGO, key32bytes, iv);

        const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
        const authTag   = cipher.getAuthTag();

        return {
            encrypted: encrypted.toString("hex"),
            iv:        iv.toString("hex"),
            tag:       authTag.toString("hex"),
            salt:      salt.toString("hex")
        };
    }

    static decryptAES(encryptedHex: string, key: string, ivHex: string, tagHex: string, saltHex: string) {
        const salt       = Buffer.from(saltHex, "hex");
        const key32bytes = scryptSync(key, salt, KEY_BYTES);
        const encrypted  = Buffer.from(encryptedHex, "hex");
        const iv         = Buffer.from(ivHex, "hex");
        const tag        = Buffer.from(tagHex, "hex");

        const decipher  = createDecipheriv(AES_ALGO, key32bytes, iv);
        decipher.setAuthTag(tag);

        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString("utf8");
    }
}
