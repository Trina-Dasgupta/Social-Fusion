import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  const { name, phone, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const user = await User.create({ name, phone, password: hashedPassword });
    res.status(201).json({ user, token: generateToken(user.id) });
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
};

export const login = async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ where: { phone } });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({ user, token: generateToken(user.id) });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};
