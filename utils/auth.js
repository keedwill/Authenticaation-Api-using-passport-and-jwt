const User = require("../models/User");
const brcypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const passport = require("passport");
const { SECRET } = require("../config/index");

const registerUser = async (userDets, role, res) => {
  try {
    // validate the username
    let usernameTaken = await validateUsername(userDets.username);
    if (usernameTaken) {
      return res.status(400).json({
        message: `Username is alraedy taken`,
      });
    }
    // validate the email
    let emailTaken = await validateEmail(userDets.email);
    if (emailTaken) {
      return res.status(400).json({
        message: `Email is alraedy registered`,
      });
    }

    //hash the password
    const hashedP = await brcypt.hash(userDets.password, 12);

    // create new user
    const newUser = new User({
      ...userDets,
      password: hashedP,
      role: role,
    });

    await newUser.save();
    return res.status(201).json({ message: `User is created`, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Unable to create your account`, success: false });
  }
};

const loginUser = async (userDets, role, res) => {
  let { username, password } = userDets;
  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(404).json({
      message: `Username does not exist. Invalid login details`,
      success: false,
    });
  }
  // check if the role matches
  if (user.role !== role) {
    return res.status(403).json({
      message: `Please make sure you are logging in from the right portal`,
      success: false,
    });
  }

  // compare the password
  let isMatch = await brcypt.compare(password, user.password);
  if (isMatch) {
    //assign a token to a user
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
      },
      SECRET,
      { expiresIn: "7 days" }
    );

    let result = {
      username: user.username,
      role: user.role,
      email: user.email,
      token: "Bearer " + token,
      expiresIn: 168,
    };
    return res.status(200).json({
      ...result,
      message: `you are now logged in`,
      success: true,
    });
  } else {
    return res.status(403).json({
      message: `Incorrect Password`,
      success: false,
    });
  }
};

const validateUsername = async (username) => {
  let user = await User.findOne({ username: username });
  return user ? true : false;
};

//passport middleware
const userAuth = passport.authenticate("jwt", { session: false });

//check role middleware
const checkRole = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    return next();
  } else {
    res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }
};

const serializeUser = (user) => {
  return {
    username: user.username,
    email: user.email,
    _id: user._id,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
  };
};

const validateEmail = async (email) => {
  let user = await User.findOne({ email: email });
  return user ? true : false;
};

module.exports = {
  registerUser: registerUser,
  loginUser: loginUser,
  userAuth: userAuth,
  serializeUser: serializeUser,
  checkRole:checkRole
};
