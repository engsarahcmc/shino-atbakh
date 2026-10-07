const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  createGoogleUser,
  getUserById,
  updateUser,
} = require("../models/userModel");
const { isAdmin } = require("../config/roles");
const { isPremium } = require("../config/premium");

// شكل المستخدم اللي يرجع للواجهة
const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role_id: user.role_id,
  is_admin: isAdmin(user),
  is_active: user.is_active !== false,
  is_premium: isPremium(user),
  premium_plan: isPremium(user) ? user.premium_plan : null,
  premium_until: isPremium(user) ? user.premium_until : null,
  created_at: user.created_at,
});

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);


const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. التأكد من البيانات الأساسية
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // 2. التأكد أن الإيميل غير مستخدم
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // 3. تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. إنشاء المستخدم
    const user = await createUser(
      name,
      email,
      hashedPassword
    );

    // 5. إرسال البيانات بدون كلمة المرور
    res.status(201).json({
      message: "User registered successfully",
      user,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. التأكد من البيانات
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2. البحث عن المستخدم
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 3. مقارنة كلمة المرور
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.is_active === false) {
      return res.status(403).json({
        message: "This account has been deactivated",
      });
    }

    // 4. إنشاء JWT
    const token = jwt.sign(
      {
        userId: user.id,
        roleId: user.role_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // 5. إرسال النتيجة
    res.json({
      message: "Login successful",
      token,
      user: publicUser(user),
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;

    let user = await findUserByGoogleId(googleId);

    if (!user) {
      user = await createGoogleUser(
        name,
        email,
        googleId
      );
    }

    if (user.is_active === false) {
      return res.status(403).json({
        message: "This account has been deactivated",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        roleId: user.role_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Google login successful",
      token,
      user: publicUser(user),
    });

  } catch (error) {
    console.error(error);

    res.status(401).json({
      message: "Invalid Google credential",
    });
  }
};
const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user: publicUser(user),
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser && existingUser.id !== req.user.userId) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const user = await updateUser(
      req.user.userId,
      name,
      email
    );

    res.json({
      message: "Profile updated successfully",
      user: publicUser(user),
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  register,
  login,
  googleLogin,
  getProfile,
  updateProfile,
};