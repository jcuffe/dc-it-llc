const Client = require("ssh2-sftp-client");

const sftp = () => new Client();

const sftpOptions = {
  host: process.env.FTP_HOST,
  port: 22,
  username: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  algorithms: {
    cipher: [
      "aes128-ctr",
      "aes192-ctr",
      "aes256-ctr",
      "aes128-gcm",
      "aes128-gcm@openssh.com",
      "aes256-gcm",
      "aes256-gcm@openssh.com",
      "aes256-cbc"
    ]
  }
};

module.exports = { sftp, sftpOptions };
