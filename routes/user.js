const express = require("express");
const { check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const router = express.Router();

const User = require("../model/user");

/**
* @swagger
* /signup:
*   post:
*     summary: Метод для создания пользователя в системе
*     parameters:
*       - in: path
*         name: username
*         required: true
*         description: Имя пользователя
*         schema:
*           type: string
*       - in: path
*         name: password
*         required: true
*         description: Пароль пользователя
*         schema:
*           type: string
*/
router.post(
    "/signup",
    [
        check("username", "Please Enter a Valid Username")
        .not()
        .isEmpty(),
        check("password", "Please enter a valid password").isLength({
            min: 3
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            username,
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
              username
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            user = new User({
                username,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Логин-метод для пользователя
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Имя пользователя в системе
 *         schema:
 *           type: string
 *       - in: path
 *         name: password
 *         required: true
 *         description: Пароль пользователя
 *         schema:
 *           type: string
 */
router.post(
    "/login",
    [
      check("username", "Please enter a valid username").isLength({
        min: 3
      }),
      check("password", "Please enter a valid password").isLength({
        min: 3
      })
    ],
    async (req, res) => {
      const errors = validationResult(req);
  
      
      res.header('Access-Control-Allow-Origin', '*');
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
  
      const { username, password } = req.body;
      try {
        let user = await User.findOne({
          username
        });
        if (!user)
          return res.status(400).json({
            message: "User Not Exist"
          });
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({
            message: "Incorrect Password !"
          });
  
        const payload = {
          user: {
            id: user.id
          }
        };
  
        jwt.sign(
          payload,
          "randomString",
          {
            expiresIn: 3600
          },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token
            });
          }
        );
      } catch (e) {
        console.error(e);
        res.status(500).json({
          message: "Server Error"
        });
      }
    }
  );

/**
 * @swagger
 * /me:
 *   get:
 *    summary: Получить информацию о пользователе
 *   responses:
 *    200:
 *      description: Информация о пользователе в формате JSON
 */
router.get("/me", auth, async (req, res) => {
try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json(user);
} catch (e) {
    res.send({ message: "Error in Fetching user" });
}
});
module.exports = router;