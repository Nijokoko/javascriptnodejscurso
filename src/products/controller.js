const createError = require('http-errors');
const debug = require("debug")("app:module-products-controller");

const { ProductsService } = require("./services");
const { Response } = require('../common/response');

const { Database } = require("../database");
const { response } = require('express');

module.exports.ProductsController = {
  getProducts: async (req, res) => {
    try {
      let products = await ProductsService.getAll();
      Response.success(res, 200, 'Lista de productos', products);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  getProduct: async (req, res) => {
    try {
      const {
        params: { id },
      } = req;
      let product = await ProductsService.getById(id);
      if (!product) {
        Response.error(res, new createError.NotFound())
      } else {
        Response.success(res, 200, `Producto ${id}`, product);
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  CreateProduct: async (req, res) => {
    try {
      const { body } = req;
      if (!body || Object.keys(body).length === 0) {
        Response.error(res, new createError.BadRequest())
      } else {
      const insertedId = await ProductsService.create(body);
      Response.success(res, 201, 'Producto agregado', insertedId )
    }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  updateProduct: async (req, res) => {
    try {
      const {params: { id }} = req;
      const { body } = req;
      if (!body || Object.keys(body).length === 0) {
        Response.error(res, new createError.BadRequest())
      } else {
      const insertedId = await ProductsService.update(id, body);
      Response.success(res, 201, 'Producto actualizado', insertedId )
    }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },

  dlt: async ( req,res ) => {
  try {
    const {
      params: {id},
    } = req;
    let product = await ProductsService.dlt(id);
    console.log(product);
    if (product.deletedCount === 1) {
      Response.success(res, 202, `producto ${id} eliminado`, product);
    } else {
      Response.error( res, new createError.NotFound())
    }
  } catch (error) {
    debug(error);
    Response.error(res);
  }
  },

  generateReport: (req, res) => {
    try {
      ProductsService.generateReport('Inventario', res);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  }
};
