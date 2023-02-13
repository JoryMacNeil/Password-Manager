const crypto = require("crypto");
const fs = require("fs");

class PasswordManager {
  constructor() {
    this.passwords = {};
  }

  // Function to encrypt password
  encrypt(password) {
    const cipher = crypto.createCipher("aes256", "secret-key");
    let encrypted = cipher.update(password, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  // Function to decrypt password
  decrypt(encryptedPassword) {
    const decipher = crypto.createDecipher("aes256", "secret-key");
    let decrypted = decipher.update(encryptedPassword, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  // Function to add a password to the password manager
  addPassword(service, username, password) {
    const encryptedPassword = this.encrypt(password);
    this.passwords[service] = { username, password: encryptedPassword };
  }

  // Function to get a password from the password manager
  getPassword(service) {
    const passwordInfo = this.passwords[service];
    if (passwordInfo) {
      const decryptedPassword = this.decrypt(passwordInfo.password);
      return { username: passwordInfo.username, password: decryptedPassword };
    }
    return null;
  }

  // Function to save the passwords to a file
  saveToFile(filePath) {
    fs.writeFileSync(filePath, JSON.stringify(this.passwords));
  }

  // Function to load the passwords from a file
  loadFromFile(filePath) {
    try {
      const data = fs.readFileSync(filePath);
      this.passwords = JSON.parse(data);
    } catch (error) {
      console.error(`Error reading file: ${error}`);
    }
  }
}

const passwordManager = new PasswordManager();
passwordManager.addPassword("gmail", "user@gmail.com", "secretPassword");
passwordManager.saveToFile("passwords.json");

const loadedPasswordManager = new PasswordManager();
loadedPasswordManager.loadFromFile("passwords.json");
const password = loadedPasswordManager.getPassword("gmail");
console.log(password);