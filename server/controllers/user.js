const jwt = require("../services/jwt");
const bcrypt = require('bcrypt');
const { has } = require('underscore');
const User = require("../models/usuario");



function signUp(req, res) {
  const user = new User();
  const saltRounds = 10;
  const {  nombre,lastname,age,altura,peso,genero,email, password, repeatPassword } = req.body;
  user.nombre = nombre.toLowerCase();
  user.lastname = lastname.toLowerCase();
  user.email = email.toLowerCase();
  user.age = age;
  user.altura = altura;
  user.altura = peso;
  user.genero = genero

  if (!password || !repeatPassword) {
    res.status(404).send({message:"Las contraseñas son obligatorias"})
  }else{
    if (password !== repeatPassword) {
      res.status(404).send({ message: "Las contraseñas no son iguales." });
    }else{
      bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) {
          res.status(500).send({message:"Error al encriptar la contraseña"})
        }else{
          user.password = hash
          user.save((err,userStored) => {
            if (err) {
              res.status(500).send({message:"Error del servidor"})
            } else {
              if (!userStored) {
                res.status(404).send({message:"error al crear usuario"})
              }else{
                res.status(200).send({user: userStored})
              }
            }
          })
        }
      });
        
     
  
    }
  }
}

// function signUp(req, res) {
//   const usuario = new Usuario();
  
//   const { nombre,lastname,age,altura,peso,genero,email, password, repeatPassword } = req.body;
//   usuario.nombre = nombre.toUpperCase();
//   usuario.lastname = lastname.toUpperCase();
//   usuario.age = age;
//   usuario.altura = altura;
//   usuario.peso = peso;
//   usuario.genero = genero
//   usuario.email = email.toLowerCase();

//   usuario.active = false;

//   if (!password || !repeatPassword) {
//     res.status(404).send({  message: "Las contraseñas son obligatorias." });
//   } else {
//     if (password !== repeatPassword) {
//       res.status(404).send({  message: "Las contraseñas no son iguales." });
//     } else {

//       bcrypt.genSalt(10, function(err, salt) {
//         if (err) {
//           res.status(500).send({  message:"Error al encriptar"})
//         } 
         
        
//         bcrypt.hash(password, salt, function(err, hash) {
//              usuario.password = hash;
//               usuario.save((err, userStored) => {
//                 if (err) {
//                   console.log(err);
//                   res.status(500).send({  message: "El usuario ya existe." });
//                 } else {
//                   if (!userStored) {
//                     res.status(404).send({  message: "Error al crear el usuario." });
//                   } else {
//                     res.status(200).send({ usuario: userStored, message:"Usuario creado correctamente" });
//                   }
//                 }
//             })
            
//         });
//       });
    
//     }
    
  //const body = req.body;
  
  // const usuario = new Usuario({
  //   nombre: body.nombre,
  //   email: body.email.toLowerCase(),
  //   password: bcrypt.hashSync(body.password, 10),
  
  //   role: body.role,
  // });
  
  //}

    // usuario.save((err, usuarioDB) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok:false,
    //             err
    //         });
    //     }
    //     //usuarioDB.password = null;
    //     res.json({
    //         ok: true,
    //         usuario :usuarioDB
    //     })
    // })
//}


function signIn(req, res) {
  const params = req.body;
  const email = params.email.toLowerCase();
  const password = params.password;

  User.findOne({email}, (err, userStored) => {
    if (err) {
        res.status(500).send({message: "Error en el servidor", respuesta: 'error' })
    } else {
        if (!userStored) {
            res.status(404).send({message:"Usuario no encontrado", respuesta: 'error' })
        } else {
            bcrypt.compare(password, userStored.password, (err,check)=>{
                if (err) {
                    res.status(500).send({ message: "Error del servidor.", respuesta: 'error' });
                }else if (!check) {
                    res.status(404).send({ message: "La contraseña es incorrecta.", respuesta: 'error'  });
                }else{

                    res.status(200).send({
                        conection : true,
                        respuesta: 'success',
                        message:"Usuario conectado correctamente",
                        accessToken: jwt.createAccessToken(userStored),
                        refreshToken: jwt.createRefreshToken(userStored)
                      });
                }
            })
        }
        
    }
})
}

function getUsers(req, res) {
 
  User.find().then(users => {
    if (!users) {
      res.status(404).send({ message: "No se ha encontrado ningun usuario." });
    } else {
      res.status(200).send({ users });
    }
  });
}

function getUser(req,res) {
  let termino = req.params.termino.toLowerCase();
  let regex = new RegExp(termino, 'i')
  User.find({ $or: [ {nombre: regex}, {lastname: regex}, {email: regex} ]}).then(users => {
    if (!users) {
      res.status(404).send({ message: "No se ha encontrado ningun usuario." });
    } else {
      res.status(200).send({ users });
    }
  });
}

function getPaciente(req,res) {
  let id = req.params.id;
  
  User.findById(id, (err,pacienteDB) => {
     if (err) {
      res.status(404).send({
        message:'Paciente no existe'
      })
     } else {
       res.status(200).send({
         ok:true,
         pacienteDB
       })
     }
  }) 
}

function updateUser(req,res) {
  let userData = req.body;
  userData.email = req.body.email.toLowerCase();
  userData.nombre = req.body.nombre.toLowerCase();
  userData.lastname = req.body.lastname.toLowerCase();

  console.log(userData.nombre);
  console.log(userData.lastname);
  User.findByIdAndUpdate({_id: userData.id}, userData, (err, userUpdate) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userUpdate) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ningun usuario." });
      } else {
        res.status(200).send({ message: "Usuario actualizado correctamente." });
      }
    }
  });
  
}

function updateDieta(req,res) {
 
  let body = req.body;
  console.log(req.params);
  console.log(body);
  
  console.log("post Dieta");
  
}

function getUsersActive(req, res) {
  const query = req.query;

  User.find({ active: query.active }).then(users => {
    if (!users) {
      res.status(404).send({ message: "No se ha encontrado ningun usuario." });
    } else {
      res.status(200).send({ users });
    }
  });
}



module.exports = {
    signUp,
    signIn,
    getUsers,
    getUser,
    getPaciente,
    updateDieta,
    updateUser
  };