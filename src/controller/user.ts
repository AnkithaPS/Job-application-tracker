import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db";
import dotenv from "dotenv";
dotenv.config();

//Register new user
export const registerUser = async (req: any, res: any, next: any) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email/Password is required" });
    }
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email],
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exits!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const users = await pool.query(
      "INSERT INTO users(name,email,password)VALUES($1,$2,$3) RETURNING id,name,email",
      [name, email, hashedPassword],
    );
    res
      .status(202)
      .json({ message: "User registered successfully!", data: users.rows[0] });
  } catch (error) {
    next(error);
  }
};

//Login new user
export const loginUser = async (req: any, res: any, next: any) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email/Password is required" });
    }
    const existingUser = await pool.query(
      "SELECT * from users WHERE email=$1",
      [email],
    );
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: "User not Found!" });
    }
    const verifyPassword = await bcrypt.compare(
      password,
      existingUser.rows[0].password,
    );
    if (!verifyPassword) {
      res.status(400).json({ message: "Invalid Password!, please try again" });
    }
    const token = jwt.sign(
      { id: existingUser.rows[0].id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1hr",
      },
    );
    res.status(200).json({ message: "User logged in successfully!", token });
  } catch (error) {
    next(error);
  }
};
