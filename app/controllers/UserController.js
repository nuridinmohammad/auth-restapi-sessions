import argon2 from "argon2";
import UserModel from "../models/UserModel.js";

export const getUsers = async (req, res) => {
  try {
    const response = await UserModel.findAll({
      attributes: ["uuid", "name", "email", "role"],
    });
    if (!response) res.status(400).json(response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await UserModel.findOne({
      attributes: ["uuid", "name", "email", "role"],
      where: {
        uuid: req.params.id,
      },
    });
    if (!response) res.status(400).json(response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  const hashPassword = await argon2.hash(password);
  if (password !== confPassword)
    res.status(400).json({ msg: "Password dan Confirm Password Tidak Sama!" });
  try {
    const response = await UserModel.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });
    if (!response) {
      return res.status(400).json({ msg: "Field Harus Diisi!", response });
    }
    return res.status(201).json({ msg: "Register Success", response });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  const user = await UserModel.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) res.status(404).json({ msg: "User Tidak Ditemukan" });
  const { name, email, password, confPassword, role } = req.body;
  let hashPassword;
  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  if (password !== confPassword)
    res.status(400).json({ msg: "Password dan Confirm Password Tidak Sama!" });

  try {
    const response = await UserModel.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    if (!response) {
      return res.status(400).json({ msg: "Field Harus Diisi!", response });
    }
    return res
      .status(200)
      .json({ msg: "User Success Update", updateNumber: response });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await UserModel.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) res.status(404).json({ msg: "User Tidak Ditemukan" });
  try {
    await UserModel.destroy({
      where: {
        id: user.id,
      },
    });
    return res.status(200).json({ msg: "User Success Deleted" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
