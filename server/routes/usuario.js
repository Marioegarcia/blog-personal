const express = require("express");

const _ = require('underscore');

const UserController = require("../controllers/user");


const { verificaToken } = require('../middlewares/authenticacion');

const api = express.Router();




api.post("/sign-up", UserController.signUp);
api.post("/sign-in", UserController.signIn);

api.get("/pacientes", UserController.getUsers);
api.get("/pacientes/buscar/:termino", UserController.getUser);
api.get("/paciente/:id", UserController.getPaciente)

api.put("/usuario", UserController.updateDieta);

api.put('/update', UserController.updateUser);

api.get("/usuario" ,(req, res) => {
console.log("usuario");
  // let desde = req.query.desde || 0;
  // desde = Number(desde);

  // let limite = req.query.limite || 5;
  // limite = Number(limite);

  // Usuario.find({ estado:true } , 'nombre email role estado img google, password')
  //     // .skip(desde)
  //     // .limit(limite)
  //     .exec((err,usuarios) => {
  //       if(err){
  //         return res.status(400).json({
  //           ok:false,
  //           err
  //         });
  //       }
  //       Usuario.count({estado:true}, (err,conteo) => {
  //         res.json({
  //           ok:true,
  //           usuarios,
  //           cuantos:conteo
  //         });
  //       });
        

  //     })
});


api.post("/usuario", verificaToken , function (req, res) {
 const body = req.body;
  
  
  const usuario = new Usuario({
    nombre: body.nombre,
    email: body.email.toLowerCase(),
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });
  
  // const usuario = new Usuario();
  
  // const { nombre,email, password } = req.body;
  // usuario.nombre = nombre;
  // usuario.email = email.toLowerCase();
  // console.log(body);
//   user.active = false;

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok:false,
                err
            });
        }
        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario :usuarioDB
        })
    })
  
});



//api.put("/usuario/:id",function (req, res) {

 // console.log("usuarioooo");
  
  // let userData = req.body;
  // userData.email = req.body.email
  // const params = req.params;
  // console.log(userData);
  // console.log(params);

  // Usuario.findByIdAndUpdate({_id:params.id}, userData, (err, userUpdate)=>{
  //       if(err){
  //     return res.status(400).json({
  //       ok:false,
  //       err
  //     });
  //   }

  //   res.json({
  //       ok: true,
  //       usuario: userUpdate
  //     });
  // })


  // let id = req.params.id;
  // let body = _.pick(req.body , ['nombre','email','img','role','estado']);

  // Usuario.findByIdAndUpdate(id, body, {new:true, runValidators:true} ,(err, usuarioDB)=>{
  //   if(err){
  //     return res.status(400).json({
  //       ok:false,
  //       err
  //     });
  //   }

  //   res.json({
  //       ok: true,
  //       usuario: usuarioDB
  //     });

  // })
  
//});

api.delete("/usuario/:id", verificaToken , function (req, res) {
  
  const id = req.params.id;
  const cambiaEstado = {
    estado: false
  }
  Usuario.findByIdAndRemove(id, (err, usuarioDelete ) => {
  //Usuario.findByIdAndUpdate(id,cambiaEstado,{new:true}, (err, usuarioDelete ) => {
    if(err){
      return res.status(400).json({
        ok:false,
        err
      });
    };

    if (usuarioDelete === null) {
      return res.status(400).json({
        ok:false,
        err : {
          message: 'Usuario no encontrado'
        }
      })
    }

    res.json({
      ok:true,
      usuario: usuarioDelete
    });


  })



});

module.exports = api;
