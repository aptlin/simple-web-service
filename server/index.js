import bodyParser from "body-parser";
import express from "express";
import { createFakeUsers } from "./utils";
import APP_ROOT from "app-root-path";
import compression from "compression";

const app = express();
const dbPromise = createFakeUsers();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  if (req.url === "/users") {
    req.url = "/users.html";
  }
  next();
});
app.use(express.static(APP_ROOT + "/publish/client"));

app.use(compression());
app.get("/fetch-users", (req, res) => {
  dbPromise.then(db => {
    db.serialize(() => {
      const stmt = db.prepare("SELECT * FROM users WHERE isActive = 1");
      stmt.all((err, users) => {
        if (err) {
          console.error(JSON.stringify(err));
        }
        res.send(users);
      });
    });
  });
});

app.get("/by-login", (req, res) => {
  const login = req.query.login;

  dbPromise.then(db => {
    db.serialize(() => {
      const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
      stmt.all(login, (err, users) => {
        if (err) {
          console.error(JSON.stringify(err));
        }
        if (users.length > 0) {
          res.send(users[0]);
        } else {
          res.send({});
        }
      });
    });
  });
});

app.get("/by-id", (req, res) => {
  const id = req.query.id;
  dbPromise.then(db => {
    db.serialize(() => {
      const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
      stmt.all(id, (err, users) => {
        if (err) {
          console.error(JSON.stringify(err));
        }
        if (users.length > 0) {
          res.send(users[0]);
        } else {
          res.send({});
        }
      });
    });
  });
});

app.listen(3000, () => {
  console.log("Server started at http://localhost:3000/");
});
