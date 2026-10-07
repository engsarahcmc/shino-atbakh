const adminModel = require("../models/adminModel");
const { ids } = require("../config/roles");

const decorate = (user) => user && { ...user, is_admin: Number(user.role_id) === ids.admin };

const getStats = async (req, res) => {
  try {
    res.json(await adminModel.getStats(ids.admin));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const { users, total } = await adminModel.listUsers({
      search: String(req.query.search || ""),
      limit,
      offset,
    });
    res.json({ users: users.map(decorate), total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateRole = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { role } = req.body; // "user" أو "admin"

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "role must be 'user' or 'admin'" });
    }
    if (id === req.admin.id && role !== "admin") {
      return res.status(400).json({ message: "You cannot remove your own admin role" });
    }

    const user = await adminModel.setRole(id, role === "admin" ? ids.admin : ids.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Role updated", user: decorate(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be true or false" });
    }
    if (id === req.admin.id && !isActive) {
      return res.status(400).json({ message: "You cannot deactivate your own account" });
    }

    const user = await adminModel.setActive(id, isActive);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Status updated", user: decorate(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const removeUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (id === req.admin.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const deleted = await adminModel.deleteUser(id);
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getStats, getUsers, updateRole, updateStatus, removeUser };
