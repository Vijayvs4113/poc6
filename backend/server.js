require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

app.post("/api/students", (req, res) => {
  const { name, email, course } = req.body;

  const sql =
    "INSERT INTO students (name, email, course) VALUES (?, ?, ?)";

  db.query(sql, [name, email, course], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      id: result.insertId,
      name,
      email,
      course
    });
  });
});

app.delete("/api/students/:id", (req, res) => {
  db.query(
    "DELETE FROM students WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "Student deleted" });
    }
  );
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});