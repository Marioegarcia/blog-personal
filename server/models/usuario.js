const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE", "NUTRI_ROLE"],
  message: "{VALUE} no es un rol valido",
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
  },
  age: Number,
  altura: Number,
  peso: Number,
  genero: String,
  email: {
    type: String,
    unique: true,
    required: [true, "correo no valido"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es requerida"],
  },
  img: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "ADMIN_ROLE",
    enum: rolesValidos,
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  }
  

});

usuarioSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

usuarioSchema.plugin(uniqueValidator, { message: "{PATH}" });

module.exports = mongoose.model("Usuario", usuarioSchema);
