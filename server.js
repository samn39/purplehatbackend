const { response } = require("express");
const path = require("path");
const express = require("express");
const pool = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwtGenerator = require("./utils/jwtGenerator");
const validInfo = require("./middleware/validInfo");
const authorization = require("./middleware/authorization");

const app = express();

const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



//new user input
app.post("/contact", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = await pool.query(
      "INSERT INTO info (name, email, phone) VALUES($1, $2, $3)",
      [name, email, phone]
    );
    res.json(newContact);
    // res.redirect("http://localhost:3000/thanks");
  } catch (err) {
    console.error(err.message);
  }
});

//get all contact
app.get("/contact", async (req, res) => {
  try {
    const allContact = await pool.query("SELECT * FROM info");
    res.json(allContact.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get individual contact
app.get("/contact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allContact = await pool.query(
      "SELECT * FROM info WHERE user_id = $1",
      [id]
    );
    res.json("allContact.rows[0]");
  } catch (err) {
    console.error(err.message);
  }
});

//delete individual contact
app.delete("/contact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allContact = await pool.query("DELETE FROM info WHERE user_id = $1", [
      id,
    ]);
    res.json("contact deleted :D");
  } catch (err) {
    console.error(err.message);
  }
});

//sign up manually just for admin
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newAdmin = await pool.query(
      "INSERT INTO admin (username, password) VALUES($1, $2) RETURNING *",
      [username, bcryptPassword]
    );
    res.json(newAdmin.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/login", validInfo, async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await pool.query("SELECT * FROM admin WHERE username = $1", [
      username,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).send("Username or Password is incorrect");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    // console.log(validPassword);

    if (!validPassword) {
      return res.status(401).json("Username or Password is incorrect");
    }

    const token = jwtGenerator(user.rows[0].user_id);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/verify", authorization, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/count", async (req, res) => {
  try {
    const count = await pool.query("SELECT * FROM count");
    res.json(count.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//make a put
app.put("/count", async (req, res) => {
  try {
    const { hatcount } = req.body;
    const count = await pool.query(
      "UPDATE count SET hatcount = $1 WHERE id = 1",
      [hatcount]
    );
    res.json("sucess");
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`express server running on port ${PORT}`);
});
