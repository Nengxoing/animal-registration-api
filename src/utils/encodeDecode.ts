import env from "./env";

const BARCODE_SALT = env.BARCODE_SALT;
const ALPHABET = env.ALPHABET;

export const encode = ({ text, salt = env.BARCODE_SALT }: { text: string; salt: string }): string => {
  return text
    .split("")
    .map((char, i) => {
      const charIndex = ALPHABET.indexOf(char);
      const saltIndex = ALPHABET.indexOf(salt[i % salt.length]);
      if (charIndex === -1) {
        const numberToChar = (parseInt(char) % ALPHABET.length); 
        return ALPHABET[numberToChar + saltIndex % ALPHABET.length];
      }
      if (saltIndex === -1) {
        throw new Error(`Invalid character in salt: '${salt[i % salt.length]}'`);
      }
      return ALPHABET[(charIndex + saltIndex) % ALPHABET.length];
    })
    .join("");
};

export const decode = (encodedText: string, salt: string = BARCODE_SALT): string => {
  const decodedText = encodedText
    .split("")
    .map((char, i) => {
      const charIndex = ALPHABET.indexOf(char); 
      const saltIndex = ALPHABET.indexOf(salt[i % salt.length]); 
      if (charIndex === -1 || saltIndex === -1) {
        throw new Error(`Invalid character in encodedText: '${char}'`);
      }
      return ALPHABET[(charIndex - saltIndex + ALPHABET.length) % ALPHABET.length]; 
    })
    .join("");
  return decodedText.replace(/[0-9]/g, ""); 
};
