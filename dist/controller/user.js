"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//Register new user
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email/Password is required" });
        }
        const existingUser = await db_1.default.query("SELECT * FROM users WHERE email=$1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User already exits!" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const users = await db_1.default.query("INSERT INTO users(name,email,password)VALUES($1,$2,$3) RETURNING id,name,email", [name, email, hashedPassword]);
        res
            .status(202)
            .json({ message: "User registered successfully!", data: users.rows[0] });
    }
    catch (error) {
        next(error);
    }
};
exports.registerUser = registerUser;
//Login new user
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email/Password is required" });
        }
        const existingUser = await db_1.default.query("SELECT * from users WHERE email=$1", [email]);
        if (existingUser.rows.length === 0) {
            return res.status(404).json({ message: "User not Found!" });
        }
        const verifyPassword = await bcrypt_1.default.compare(password, existingUser.rows[0].password);
        if (!verifyPassword) {
            res.status(400).json({ message: "Invalid Password!, please try again" });
        }
        const token = jsonwebtoken_1.default.sign({ id: existingUser.rows[0].id }, process.env.JWT_SECRET, {
            expiresIn: "1hr",
        });
        res.status(200).json({ message: "User logged in successfully!", token });
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
