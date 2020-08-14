const router = require("express").Router();
const {
  registerUser,
  loginUser,
  userAuth,
  serializeUser,
  checkRole,
} = require("../utils/auth");

/**
 * @swagger
 * /api/users/register-user:
 *  post:
 *    description: Used to register a new user
 *    responses:
 *        '201':
 *          'Succesfull'
 */

//users registration
router.post("/register-user", async (req, res) => {
  await registerUser(req.body, "user", res);
});


/**
 * @swagger
 * /api/users/register-admin:
 *  post:
 *    description: Used to register a new admin
 *  responses:
 *        '201':
 *          'Succesfull'
 */
//admin registration
router.post("/register-admin", async (req, res) => {
  await registerUser(req.body, "admin", res);
});


//superadmin registration
router.post("/register-super-admin", async (req, res) => {
  await registerUser(req.body, "superadmin", res);
});

/**
 * @swagger
 * /api/users/login-user:
 *  post:
 *    description: Used to login a  user and a Token is giving
 *  responses:
 *        '200':
 *          'Succesfull'
 */
//users login
router.post("/login-user", async (req, res) => {
  await loginUser(req.body, "user", res);
});

/**
 * @swagger
 * /api/users/login-admin:
 *  post:
 *    description: Used to login an admin and a Token is giving
 */
//admin login
router.post("/login-admin", async (req, res) => {
  await loginUser(req.body, "admin", res);
});
//superadmin login
router.post("/login-superadmin", async (req, res) => {
  await loginUser(req.body, "superadmin", res);
});

/**
 * @swagger
 * /api/users/profile:
 *  get:
 *    description: Used to display user details and can only be accessed by a user with a token
 */
//profile route
router.get("/profile", userAuth, async (req, res) => {
  return res.json(serializeUser(req.user));
});

//user only routes
router.get("/user-protected", userAuth, checkRole(['user']), async (req, res) => {

});

//admin protected
router.get("/admin-protected", userAuth, checkRole(['admin']), async (req, res) => {

});

//superadmin protected
router.get("/superadmin-protected", userAuth, checkRole(['superadmin']), async (req, res) => {

});

module.exports = router;
