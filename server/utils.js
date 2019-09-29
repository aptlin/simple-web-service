import axios from "axios";
import { random, internet, finance, hacker } from "faker";
import config from "./config";
const { Database } = require("sqlite3").verbose();

export async function createUser() {
  const response = await axios.get(
    "https://source.unsplash.com/random/96x96/?" + hacker.adjective()
  );
  return {
    id: 0,
    username: internet.email(),
    balance: random.number(),
    creditCardNumber: finance.creditCardNumber(),
    isActive: random.boolean(),
    logo: response.request.res.responseUrl
  };
}

export async function createFakeUsers() {
  const db = new Database(":memory:");
  const state = {
    inactiveUsersNumber: 0,
    activeUsersNumber: 0,
    adminsNumber: 0
  };
  const users = [];
  const passwords = [];
  while (
    state.activeUsersNumber < 3 ||
    state.inactiveUsersNumber < 2 ||
    state.activeUsersNumber + state.inactiveUsersNumber < config.FAKE_USERS_NUM
  ) {
    const user = await createUser();
    if (user.isActive) {
      if (state.adminsNumber < 1) {
        user.username = "admin";
        state.adminsNumber++;
      }
      state.activeUsersNumber++;
    } else {
      state.inactiveUsersNumber++;
    }
    user.id = state.activeUsersNumber + state.inactiveUsersNumber;
    users.push(user);
    passwords.push(internet.password());
  }
  db.serialize(() => {
    db.run(
      "CREATE TABLE users (id TEXT PRIMARY KEY, username TEXT, balance REAL, creditCardNumber INTEGER, isActive INTEGER, logo TEXT)",
      err => {
        if (err) {
          console.log("Failed creating the user database.");
          console.log(err.message);
        }
      }
    );
    db.run(
      "CREATE TABLE passwords (id TEXT PRIMARY KEY, password TEXT)",
      err => {
        if (err) {
          console.log("Failed creating the database with passwords.");
          console.log(err.message);
        }
      }
    );
    const insertUser = db.prepare(
      "INSERT INTO users VALUES (:id, :username, :balance, :creditCardNumber, :isActive, :logo)",
      err => {
        if (err) {
          console.log("Failed to insert the nuw user.");
          console.log(err.message);
        }
      }
    );
    const insertPassword = db.prepare(
      "INSERT INTO passwords VALUES (:id, :password) "
    );

    for (let idx = 0; idx < users.length; ++idx) {
      const user = users[idx];
      insertUser.run(
        user.id,
        user.username,
        user.balance,
        user.creditCardNumber,
        user.isActive,
        user.logo
      );
      insertPassword.run(user.id, passwords[idx]);
    }
    insertUser.finalize();
    insertPassword.finalize();
  });
  return db;
}
