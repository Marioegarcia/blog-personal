const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "marioezequielgarciahuerta";

exports.ensureAuth = (req, res, next) => {
  const producto = req.body;
  
  if (!req.headers.token) {
    return res
      .status(403)
      .send({ message: "La peticion no tiene la cabecera de Autenticacion." });
  }

 
  let token = req.headers.token.replace(/['"]+/g, "");
  
  try {
    var payload = jwt.decode(token, SECRET_KEY);

    if (payload.exp <= moment().unix()) {
      return res.status(404).send({ message: "El token ha expirado." });
    }
  } catch (ex) {
    //console.log(ex);
    return res.status(404).send({ message: "Token invalido." });
  }
  req.user = payload;
  
  next();
};