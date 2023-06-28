import UserModel from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res
        .status(401)
        .json({ msg: "Mohon Login ke Akun anda terlebih dahulu!" });
    }
    const user = await UserModel.findOne({
      where: {
        uuid: req.session.userId,
      },
    });
    if (!user) res.status(404).json({ msg: "User Tidak Ditemukan!" });
    req.userId = user.id;
    req.role = user.role;
    next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({
      where: {
        uuid: req.session.userId,
      },
    });
    if (!user) return res.status(404).json({ msg: "User Tidak Ditemukan!" });
    if (user.role !== "admin") return res.status(403).json({ msg: "Akses Terlarang!" });
    next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
