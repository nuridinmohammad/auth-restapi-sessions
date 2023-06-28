import { Op } from "sequelize";
import ProductModel from "../models/ProductModel.js";
import UserModel from "../models/UserModel.js";

export const getProducts = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await ProductModel.findAll({
        attributes: ["uuid", "name", "price"],
        include: [{ model: UserModel, attributes: ["name", "email"] }],
      });
    } else {
      response = await ProductModel.findAll({
        attributes: ["uuid", "name", "price"],
        where: { userId: req.userId },
        include: [{ model: UserModel, attributes: ["name", "email"] }],
      });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) {
      return res.status(404).json({ msg: "Product Tidak Ditemukan!" });
    }
    let response;
    if (req.role === "admin") {
      response = await ProductModel.findOne({
        where: { id: product.id },
        attributes: ["uuid", "name", "price"],
        include: [{ model: UserModel, attributes: ["name", "email"] }],
      });
    } else {
      response = await ProductModel.findOne({
        attributes: ["uuid", "name", "price"],
        where: { [Op.and]: [{ id: product.id }, { userId: req.userId }] },
        include: [{ model: UserModel, attributes: ["name", "email"] }],
      });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, price } = req.body;
  try {
    const products = await ProductModel.create({
      name: name,
      price: price,
      userId: req.userId,
    });
    res
      .status(201)
      .json({ msg: "Product was created Success!", data: products });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await ProductModel.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) {
      return res.status(404).json({ msg: "Product Tidak Ditemukan!" });
    }

    const { name, price } = req.body;
    if (req.role === "admin") {
      await ProductModel.update(
        { name, price },
        {
          where: { id: product.id },
        }
      );
    } else {
      if (req.userId !== product.userId) {
        return res.status(403).json({ msg: "Akses Terlarang!" });
      }
      await ProductModel.update(
        { name, price },

        {
          where: { [Op.and]: [{ id: product.id }, { userId: req.userId }] },
        }
      );
    }
    return res.status(200).json({ msg: "Product was Update Success!" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) {
      return res.status(404).json({ msg: "Product Tidak Ditemukan!" });
    }

    if (req.role === "admin") {
      await ProductModel.destroy({
        where: { id: product.id },
      });
    } else {
      if (req.userId !== product.userId) {
        return res.status(403).json({ msg: "Akses Terlarang!" });
      }
      await ProductModel.destroy({
        where: { [Op.and]: [{ id: product.id }, { userId: req.userId }] },
      });
    }
    return res.status(200).json({ msg: "Product was Deleted Success!" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
