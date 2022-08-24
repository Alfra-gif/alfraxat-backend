const User = require("../models/user_model");
const jwt = require('jsonwebtoken');
const express = require("express");
const req = require('request');
const auth = (require("../middleware/auth"))
userController = require ("../controllers/user_controller");

router = express.Router();
var multipart = require("connect-multiparty")
var multipartMiddleware = multipart({uploadDir: "./uploads"})

//router.get("/home", userController.home);
//router.post("/test", userController.test);
router.post("/save-user", userController.save_user);
router.post("/login", userController.login);
router.get("/get-user/:id", userController.get_user);
router.get("/search-user/:username", userController.search_user);
router.post("/update-user", userController.update_user);
router.post("/upload-image/:id",multipartMiddleware, userController.upload_image);
router.get("/get-image/:image",userController.get_image);

router.post("/create-chat", userController.create_chat);
router.post("/insert-messages", userController.insert_message);
router.get("/get-chat/:id", userController.get_chat);

router.get("/users", userController.get_users);
//router.put("/user/:id", userController.update_user);
//router.delete("/delete-chat", userController.delete_chat);
module.exports = router;