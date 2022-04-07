const createError = require('http-errors');
const debug = require("debug")("app:module-users-controller");

const { SalesService } = require("./services");
const { Response } = require('../common/response');

module.exports.SalesController = {
  getSales: async (req, res) => {
    try {
      let sale = await SalesService.getAll();
      Response.success(res, 200, 'Lista de ventas', sale);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  getSale: async (req, res) => {
    try {
      const {
        params: { id },
      } = req;
      let sale = await SalesService.getById(id);
      if (!sale) {
        Response.error(res, new createError.NotFound())
      } else {
        Response.success(res, 200, `Venta ${id}`, sale);
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  CreateSale: async (req, res) => {
    try {
      const { body } = req;
      if (!body || Object.keys(body).length === 0) {
        Response.error(res, new createError.BadRequest())
      } else {
      const insertedId = await SalesService.create(body);
      Response.success(res, 201, 'Venta agregada', insertedId )
    }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  updateSale: async (req, res) => {
    try {
      const {params: { id }} = req;
      const { body } = req;
      if (!body || Object.keys(body).length === 0) {
        Response.error(res, new createError.BadRequest())
      } else {
      const insertedId = await SalesService.update(id, body);
      Response.success(res, 201, 'Venta actualizada', insertedId )
    }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },

  dltSale: async ( req,res ) => {
  try {
    const {
      params: {id},
    } = req;
    let sale = await SalesService.dlt(id);
    if (sale.deletedCount === 1) {
      Response.success(res, 202, `Venta ${id} eliminada`, sale);
    } else {
      Response.error( res, new createError.NotFound())
    }
  } catch (error) {
    debug(error);
    Response.error(res);
  }
  },
};