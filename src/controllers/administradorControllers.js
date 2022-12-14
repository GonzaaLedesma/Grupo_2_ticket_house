const db = require("../database/models");
const sequelize = db.sequelize;
const { check, validationResult } = require("express-validator");


const administradorController = {
  creacion: (req, res) => {
    res.render("products/creacionProducto", { titlePage: "- Creacion" });
  },
  edicion: async (req, res) => {
    const editarProducto = await db.Evento.findByPk(req.params.id);
    res.render("products/edicionProducto", {
      editarProducto,
      titlePage: "- Edicion",
    });
  },
  creacionPost: async (req, res) => {
    const errors = validationResult(req);

    if (errors.errors.length > 0) {
      return res.render("products/creacionProducto", {
        errors: errors.mapped(),
        oldData: req.body,
      });
    }
    const event = await db.Evento.findOne({
      where: { 
        nombre_evento: req.body.nombre_evento,
        fecha: req.body.fecha,
       },
    });
    if (event) {
      return res.render("products/creacionProducto", {
        errors: {
          nombre_evento: {
            msg: "Este evento ya está registrado",
          },
          fecha: {
            msg: "Este evento ya está registrado",
          },
        },
        oldData: req.body,
      });
    }
    const foto_evento = req.file;
    const {
      nombre_evento,
      fecha,
      ubicacion,
      sede,
      participacion,
      capacidad_sede,
      precio,
      horario,
      descripcion,
      biografia,
      id_categoria,
      evento_id,
    } = req.body;
    const data = await db.Evento.create({
      nombre_evento: nombre_evento,
      fecha: fecha,
      ubicacion: ubicacion,
      sede: sede,
      capacidad_sede: Number(capacidad_sede),
      precio: Number(precio),
      participacion: participacion,
      horario: Number(horario + "0000"),
      descripcion: descripcion,
      biografia: biografia,
      foto_evento: foto_evento.filename,
      id_categoria: id_categoria,
    });
    for (let i = 0; i < evento_id.length; i++) {
      await db.Evento_Genero.create({
        evento_id: data.dataValues.id,
        genero_id: evento_id[i],
      });
    }
    return res.redirect("../producto/catalogo");
  },
  edicionPut: async (req, res) => {
    const errors = validationResult(req);
    
    console.log(errors)

    if (errors.errors.length >= 1) {
      const editarProducto = await db.Evento.findByPk(req.params.id);
      return res.render("products/edicionProducto", {
        editarProducto,
        errors: errors.mapped(),
        oldData: req.body,
      });
    }
    const foto_evento = req.file;
    const {
      nombre_evento,
      fecha,
      ubicacion,
      sede,
      participacion,
      capacidad_sede,
      precio,
      horario,
      descripcion,
      biografia,
      id_categoria,
    } = req.body;
    await db.Evento.update(
      {
        nombre_evento: nombre_evento,
        fecha: fecha,
        ubicacion: ubicacion,
        sede: sede,
        capacidad_sede: Number(capacidad_sede),
        precio: Number(precio),
        participacion: participacion,
        // horario: "",
        // horario: Number(horario),
        descripcion: descripcion,
        biografia: biografia,
        foto_evento: foto_evento.filename,
        id_categoria: id_categoria,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    // generoBanda.forEach(async (genero) => {
    //   await db.Evento_Genero.update(
    //     {
    //       evento_id: req.params.id,
    //       genero_id: genero,
    //     },
    //     {
    //       where: {
    //         evento_id: req.params.id,
    //       },
    //     }
    //   );
    // });
    return res.redirect("../producto/catalogo");
  },
  destroy: async (req, res) => {
    let eventoId = req.params.id;
    await db.Evento_Genero.destroy({
      limit: 6,
      where: { evento_id: eventoId },
      force: true,
      cascade: true,
    });
    await db.Evento.destroy({
      where: { id: eventoId },
      force: true,
    });
    return res.redirect("../producto/catalogo");
  },
};

module.exports = administradorController;
