const { contextBridge } = require("electron");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const shortid = require("shortid");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");
// contextBridge.exposeInMainWorld("path", {
//   join: (...args) => path.join(...args),
// });

// contextBridge.exposeInMainWorld("fs", {
//   write: (file, data) => fs.writeFile(file, data),
//   read: (path) => fs.readFile(path),
// });

// contextBridge.exposeInMainWorld("bcrypt", {
//   hash: (password) => bcrypt.hash(password, 10),
//   compare: (password, hash) => bcrypt.compare(password, hash),
// });

contextBridge.exposeInMainWorld("auth", {
  register: (username, password) => {
    let users = [];
    if (username.length < 8 || username == null) {
      return "username is not valid";
    }
    fs.readFile(path.join(__dirname, "./database/users.json"), async (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      users = JSON.parse(data.toString());
      let hash = await bcrypt.hash(password, 10);
      let newUser = {
        id: shortid.generate(),
        username: username,
        password: hash,
      };
      users.push(newUser);
      fs.writeFile(path.join(__dirname, "./database/users.json"), JSON.stringify(users), function (err) {
        if (err) {
          console.log(err);
          return;
        }
        localStorage.setItem("action", "done");
      });
    });
  },
  login: (username, password) => {
    let users = [];
    let user;
    fs.readFile(path.join(__dirname, "./database/users.json"), async (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      users = JSON.parse(data.toString());
      let userValidation = users.filter((u) => u.username == username);
      if (userValidation.length > 0) {
        user = userValidation[0];
      } else {
        return;
      }
      let isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return;
      } else {
        localStorage.setItem("action", "done");
        localStorage.setItem("username", user.username);
        localStorage.setItem("password", user.password);
        localStorage.setItem("id", user.id);
      }
    });
  },
});

contextBridge.exposeInMainWorld("passwords", {
  create: (title, password) => {
    let passwords = [];
    const token = jwt.sign({ password }, localStorage.getItem("password"));
    fs.readFile(path.join(__dirname, "./database/passwords.json"), async (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      passwords = JSON.parse(data.toString());
      let newPassword = {
        id: shortid.generate(),
        userId: localStorage.getItem("id"),
        password: token,
        username: localStorage.getItem("username"),
        title,
      };
      passwords.push(newPassword);
      fs.writeFile(path.join(__dirname, "./database/passwords.json"), JSON.stringify(passwords), function (err) {
        if (err) {
          console.log(err);
          return;
        }
        localStorage.setItem("action", "done");
      });
    });
  },
  generate: (title) => {
    let passwords = [];
    let password = generator.generate({
      length: 10,
      numbers: true,
    });
    const token = jwt.sign({ password }, localStorage.getItem("password"));
    fs.readFile(path.join(__dirname, "./database/passwords.json"), async (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      passwords = JSON.parse(data.toString());
      let newPassword = {
        id: shortid.generate(),
        userId: localStorage.getItem("id"),
        password: token,
        username: localStorage.getItem("username"),
        title,
      };
      passwords.push(newPassword);
      fs.writeFile(path.join(__dirname, "./database/passwords.json"), JSON.stringify(passwords), function (err) {
        if (err) {
          console.log(err);
          return;
        }
        localStorage.setItem("action", "done");
      });
    });
  },
  get: () => {
    let decodedPasswords = [];
    fs.readFile(path.join(__dirname, "./database/passwords.json"), async (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      passwords = JSON.parse(data.toString());
      let userPasswords = passwords.filter((password) => password.userId == localStorage.getItem("id"));
      userPasswords.forEach((password) => {
        jwt.verify(password.password, localStorage.getItem("password"), (err, item) => {
          if (err) {
            return;
          }
          decodedPasswords.push({ title: password.title, password: item.password, id: password.id });
        });
      });
      localStorage.setItem("passwords", JSON.stringify(decodedPasswords));
      return userPasswords;
    });
  },
  remove: (id) => {
    fs.readFile(path.join(__dirname, "./database/passwords.json"), async (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      passwords = JSON.parse(data.toString());
      let userPasswords = passwords.filter((password) => password.id != id);
      fs.writeFile(path.join(__dirname, "./database/passwords.json"), JSON.stringify(userPasswords), function (err) {
        if (err) {
          console.log(err);
          return;
        }
        localStorage.setItem("action", "done");
      });
    });
  },
});
