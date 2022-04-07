const createError = require('http-errors');
const debug = require("debug")("app:module-users-controller");

const { UsersService } = require("./services");
const { Response } = require('../common/response');

module.exports.UsersController = {
  getUsers: async (req, res) => {
    try {
      let user = await UsersService.getAll();
      Response.success(res, 200, 'Lista de usuarios', user);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  getUser: async (req, res) => {
    try {
      const {
        params: { id },
      } = req;
      let user = await UsersService.getById(id);
      if (!user) {
        Response.error(res, new createError.NotFound())
      } else {
        Response.success(res, 200, `Usuario ${id}`, user);
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  CreateUser: async (req, res) => {
    try {
      const { body } = req;
      if (!body || Object.keys(body).length === 0) {
        Response.error(res, new createError.BadRequest())
      } else {
      const insertedId = await UsersService.create(body);
      Response.success(res, 201, 'Usuario agregado', insertedId )
    }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  updateUser: async (req, res) => {
    try {
      const {params: { id }} = req;
      const { body } = req;
      if (!body || Object.keys(body).length === 0) {
        Response.error(res, new createError.BadRequest())
      } else {
      const insertedId = await UsersService.update(id, body);
      Response.success(res, 201, 'Usuario actualizado', insertedId )
    }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },

  dltUser: async ( req,res ) => {
  try {
    const {
      params: {id},
    } = req;
    let user = await UsersService.dlt(id);
    if (user.deletedCount === 1) {
      Response.success(res, 202, `Usuario ${id} eliminado`, user);
    } else {
      Response.error( res, new createError.NotFound())
    }
  } catch (error) {
    debug(error);
    Response.error(res);
  }
  },
};