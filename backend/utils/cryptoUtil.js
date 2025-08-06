const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const secretKey = process.env.SECRET_KEY || "12345678901234567890123456789012"; // 32-byte key
const ivLength = 16; // 16 bytes for AES

function encrypt(text) {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted; // store IV and encrypted together
}

function decrypt(encryptedText) {
    const [ivHex, encrypted] = encryptedText.split(":");
    
    // Validate IV
    if (!ivHex || !encrypted) {
        throw new Error("Invalid encrypted text format");
    }

    const iv = Buffer.from(ivHex, "hex");

    if (iv.length !== 16) {
        throw new Error("Invalid IV length");
    }

    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

function isEncryptedFormat(text) {
    if (!text || typeof text !== "string") return false;
    const parts = text.split(":");
    return parts.length === 2 && /^[a-f0-9]{32}$/.test(parts[0]);
}

module.exports = { encrypt, decrypt, isEncryptedFormat };
