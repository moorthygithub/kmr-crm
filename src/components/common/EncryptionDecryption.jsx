import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY;

if (!secretKey) {
  console.error("Secret key is not defined in .env");
}

export const encryptId = (id) => {
  if (!id) {
    console.error("ID is missing");
    return "";
  }
  return CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
};

export const decryptId = (encryptedId) => {
  try {
    if (!encryptedId) {
      console.error("Encrypted ID is missing");
      return "";
    }
    const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption Error:", error);
    return "";
  }
};
//Token Useer Name and User Id encrypted
export const encryptData = (data) => {
  if (!data) return "";
  return CryptoJS.AES.encrypt(data.toString(), secretKey).toString();
};

// Decrypt data
export const decryptData = (encryptedData) => {
  try {
    if (!encryptedData) return "";
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption Error:", error);
    return "";
  }
};
