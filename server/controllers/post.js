const Post = require("../models/post");
const slugify = require('slugify');
const fs = require("fs");
const path = require("path");
const post = require("../models/post");

function addPost(req, res) {
  const body = JSON.parse(req.body.post);
  const img = req.file;
  

  const post = new Post({
    title: body.title,
    url: slugify(body.title),
    content: body.content,
    img: img.filename,
    path: img.path,
    date: body.date,
    description: body.description
  });
   
 
  post.save((err, postStored) => {
    if (err) {
      console.log(err);
      res.status(500).send({ code: 500, message: "Error del servidor." });
    } else {
      if (!postStored) {
        res
          .status(400)
          .send({ code: 400, message: "No se ha podido crear el post." });
      } else {
        res
          .status(200)
          .send({ code: 200, message: "Post creado correctamente." });
      }
    }
  });
}

function getPosts(req, res) {
  const { page = 1, limit = 1 } = req.query;

  const options = {
    page,
    limit: parseInt(limit),
    sort: { $natural:-1 }
  };

  Post.paginate({}, options, (err, postStored) => {
    if (err) {
      res.status(500).send({ code: 500, message: "Error del servidor." });
    } else {
      if (!postStored) {
        res
          .status(404)
          .send({ code: 404, message: "No se ha encontrado ningun post." });
      } else {
      
        res.status(200).send({ code: 200, posts: postStored });
      }
    }
  });
}

function updatePost(req, res) {
  const postData = req.body;

  const { id } = req.params;

  Post.findByIdAndUpdate(id, postData, (err, postUpdate) => {
    if (err) {
      res.status(500).send({ code: 500, message: "Error del servidor." });
    } else {
      if (!postUpdate) {
        res
          .status(404)
          .send({ code: 404, message: "No se ha encontrado ningun post." });
      } else {
        res
          .status(200)
          .send({ code: 200, message: "Post actualizado correctamente." });
      }
    }
  });
}

function deletePost(req, res) {
  const { id } = req.params;

  Post.findByIdAndRemove(id, (err, postDeleted) => {
    if (err) {
      res.status(500).send({ code: 500, message: "Error del servidor." });
    } else {
      if (!postDeleted) {
        res.status(404).send({ code: 404, message: "Post no encontrado." });
      } else {
        res.status(200).send({
          code: 200,
          message: "El post ha sido eliminado correctamente."
        });
      }
    }
  });
}

function getPost(req, res) {
  const { url } = req.params;

  Post.findOne({ url }, (err, postStored) => {
    if (err) {
      res.status(500).send({ code: 500, message: "Error del servidor." });
    } else {
      if (!postStored) {
        res
          .status(404)
          .send({ code: 404, message: "No se ha encontrado ningun post." });
      } else {
        
        res.status(200).send({ code: 200, posts: postStored });
        
      }
    }
  });
}

               
function getAvatar(req, res) {
  
  const avatarName = req.params.avatarName;
  
  const filePath = "./subida/img/" + avatarName;
  
  res.sendFile(path.resolve(filePath));
  
}

function getPostsBanner(req, res) {
  

 Post.find()
 .sort({$natural:-1})
 .limit(5)
 .then(post => {
    if (!post) {
      res.status(404).send({ message: "No se ha encontrado ningun usuario." });
    } else {
      
      res.status(200).send({ post });
      
    }
  });
}

function getDestacados(req,res) {
  Post.find().then(posts => {
    if (!posts) {
      res.status(404).send({ message: "No se ha encontrado ningun usuario." });
    } else {
      res.status(200).send({ posts });
    }
  });
}
 
function getPostsUltimos(req, res) {
  
  Post.find()
  .sort({$natural:-1})
  .limit(10)
  .then(post => {
     if (!post) {
       res.status(404).send({ message: "No se ha encontrado ningun usuario." });
     } else {
       
       res.status(200).send({ post });
       
     }
   });
 }



module.exports = {
  addPost,
  getPosts,
  updatePost,
  deletePost,
  getPost,
  getAvatar,
  getPostsBanner,
  getDestacados,
  getPostsUltimos
};