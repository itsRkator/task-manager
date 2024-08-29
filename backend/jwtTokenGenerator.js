const crypto = require("crypto");

/**
 * Generate a very strong JWT secret.
 *
 * @param {number} length - The length of the secret in bytes. Default is 64 bytes.
 * @returns {string} - The generated JWT secret as a Base64 string.
 */
function generateJWTSecret(length = 64) {
  // Generate random bytes
  const buffer = crypto.randomBytes(length);

  // Encode the bytes in Base64 to get a string representation
  return buffer.toString("base64");
}

// Example usage
const secret = generateJWTSecret();
console.log("JWT Secret:", secret);
