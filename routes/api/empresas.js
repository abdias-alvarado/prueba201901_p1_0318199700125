var express = require('express');
var router = express.Router();

var hashCode = require('uuid/v4');

var mdl_archivo = require('./mdl_archivo');
var data = null;

var plantilla_archivo = {
  '_id':'',
  'empresa': '',
  'url':'',
  'nombre':'',
  'year': 2019,
  'rating': 0,
  'fechaIng': null
};

// ============================= INSERTAR ====================================
router.post('/nuevo', function(req, res, next){
  var nuevaEmpresa = Object.assign({} , plantilla_archivo, req.body);

  nuevaEmpresa._id = hashCode();
  nuevaEmpresa.fechaIng = new Date();

  if(!data){
    data = [];
  }

  data.push(nuevaEmpresa);
  mdl_archivo.write(data, function(err){
    if(err){
      return res.status(500).json({ 'error': 'Error al insertar.' });
    }
    return res.status(200).json(nuevaEmpresa);
  });
});

// ============================= CONSULTAR ====================================
router.get('/', function( req, res, next) {
  if(!data){
    mdl_archivo.read(function(err, filedata){
      if(err){
        data = [];
        return res.status(500).json({'error':'Error obteniendo los datos.'});
      }
      data = JSON.parse(filedata);
      return res.status(200).json(data);
    });
  } else {
    return res.status(200).json(data);
  }
});

// ============================= ACTUALIZAR ====================================
router.put('/actualizar/:idEmpresa', function(req, res, next){
  var idEmpresa = req.params.idEmpresa;
  var cambios = req.body;
  var actualizado = null;
  var nuevosValores = data.map(
    function(archivo, i){
      if (archivo._id == idEmpresa){
        actualizado = Object.assign(
          {},
          archivo,
          cambios,
          {'_id': idEmpresa},
          {'fechaIng': new Date()}
          );
        return actualizado;
      }
      return archivo;
    }
  );

  data = nuevosValores;
  mdl_archivo.write(data, function (err) {
    if (err) {
      return res.status(500).json({ 'error': 'Error al actualizar.' });
    }
    return res.status(200).json(actualizado);
  });
});

// ============================= ELIMINAR ====================================
router.delete('/eliminar/:idEmpresa', function(req, res, next){
  var idEmpresa = req.params.idEmpresa;
  var nuevosValores = data.filter(
    function (archivo) {
      if (archivo._id == idEmpresa) {
        return false;
      }
      return true;
    }
  );
  data = nuevosValores;
  mdl_archivo.write(data, function (err) {
    if (err) {
      return res.status(500).json({ 'error': 'Error al eliminar.' });
    }
    return res.status(200).json({"eliminado": idEmpresa});
  });
});

// ===== EVITAR QUE SE DETENGA EL SERVIDOR AL FALLO DE LECTURA INICIAL =======
mdl_archivo.read(function(err , filedata){
  if(err){
    console.log(err);
  } else{
    data = JSON.parse(filedata);
  }
});




module.exports = router;
