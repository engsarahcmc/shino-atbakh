const { getUserById } = require("../models/userModel");
const { isAdmin } = require("../config/roles");

// يسمح بالمرور للمدير بس. نتأكد من قاعدة البيانات، مو من التوكن بس،
// حتى إذا انشالت صلاحية شخص يتوقف فوراً.
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.userId);

    if (!user || user.is_active === false) {
      return res.status(403).json({ message: "Account is not active" });
    }

    if (!isAdmin(user)) {
      return res.status(403).json({ message: "Admins only" });
    }

    req.admin = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = adminMiddleware;
