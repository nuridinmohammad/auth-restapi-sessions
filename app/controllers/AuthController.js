import UserModel from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  const user = await UserModel.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(404).json({ msg: "User Tidak Ditemukan!" });
  const matchPassword = await argon2.verify(user.password, req.body.password);
  if (!matchPassword) return res.status(400).json({ msg: "Wrong Password!" });
  req.session.userId = user.uuid;
  const { uuid, name, email, role } = user;
  return res.status(200).json({ uuid, name, email, role });
};

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ msg: "Mohon Login ke Akun anda terlebih dahulu!" });
  }
  const user = await UserModel.findOne({
    attributes: ["uuid", "name", "email", "role"],
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) res.status(400).json({ msg: "user Tidak Ditemukan!" });
  return res.status(200).json({ msg: "Anda Sedang Login", user });
};

export const Logout = async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.status(400).json({ msg: "Tidak dapat Logout!" });
    }
    res.status(200).json({ msg: "Anda Telah Logout!" });
  });
};
