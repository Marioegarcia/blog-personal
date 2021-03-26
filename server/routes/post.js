const express = require("express");
const PostController = require("../controllers/post");
const multipart = require("connect-multiparty");

const md_upload_img = multipart();
const multer = require('multer');
const mimeTypes = require('mime-types');

const storage = multer.diskStorage({
    destination:'./subida/img',
    filename: function (req,file,cb) {
        cb("",Date.now() + "." + mimeTypes.extension(file.mimetype))
    } 
})
const upload = multer({
    storage
})

const api = express.Router();


api.get("/get-posts", PostController.getPosts);
api.get("/get-posts-banner", PostController.getPostsBanner);
api.get("/get-post/:url", PostController.getPost);
api.get("/get-avatar/:avatarName", PostController.getAvatar);
api.get("/get-destacados", PostController.getDestacados);
api.get("/get-posts-ultimos", PostController.getPostsUltimos);
api.post("/add-post",upload.single('img'), PostController.addPost);

api.put("/update-post/:id", PostController.updatePost);

api.delete("/delete-post/:id", PostController.deletePost);


module.exports = api;