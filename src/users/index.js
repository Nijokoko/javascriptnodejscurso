const express = require('express');

const { UsersController } = require('./controller');

const router = express.Router();

module.exports.UsersAPI = (app) => {
    router
    .get("/", UsersController.getUsers) // http://localhost:3000/api/products/
    .get("/:id", UsersController.getUser) // http://localhost:3000/api/products/23
    .post("/", UsersController.CreateUser)
    .put("/:id", UsersController.updateUser)
    .delete("/:id", UsersController.dltUser)

    app.use('/api/users', router)
}