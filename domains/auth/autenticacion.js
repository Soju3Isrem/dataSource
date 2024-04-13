
import {generarToken, verificarToken} from './vrjwt.js'


function autenticarToken(req, res, next) {
    // Obtener el token de la cabecera de autorización
    const token = req.headers['authorization'];

    // Verificar si existe el token
    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado.' });
    }
    
    // Verificar el token
    const usuario = verificarToken(token);

    if (!usuario) {
        return res.status(403).json({ mensaje: 'Usuario denegado ' });
    }

    // Almacenar el usuario en el objeto de solicitud para usarlo en rutas protegidas
    req.usuario = usuario;
    next(); // Continuar con la siguiente función de middleware o ruta
}

// module.exports = autenticarToken;
export {autenticarToken};