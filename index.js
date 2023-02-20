import express from "express";
import mysql from "mysql";
import cors from "cors";
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert { type: "json" };
const customCss = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {customCss}));

const db = mysql.createConnection({
  host: "localhost",
  user: "haris",
  password: "haris",
  database: "test",
});

app.get("/", (req, res) => {
  res.json("hello");
});

app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/signup", (req, res) => {
  const q = "INSERT INTO user(`name`, `email`, `password`, `epassword`,`date`,`gender`,) VALUES (?)";

  const values = [
    req.body.name,
    req.body.email,
    req.body.password,
    req.body.epassword,
    req.body.date,
    req.body.gender,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = " DELETE FROM books WHERE id = ? ";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "UPDATE books SET `title`= ?, `desc`= ?, `price`= ?, `cover`= ? WHERE id = ?";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [...values,bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.listen(8800, () => {
  console.log("Connected to backend.");
});
