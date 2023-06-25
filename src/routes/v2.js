"use strict";

const express = require("express");
const router = express.Router();
const dataModules = require("../models/index");
const basicAuth = require("../auth/middlewawre/basic");
const bearerAuth = require("../auth/middlewawre/bearer");
const permissions = require("../auth/middlewawre/acl");

const {
  homePage,
  handleGetAll,
  handleGetOne,
  handleCreate,
  handleUpdate,
  handleDelete,
  handleSignup,
  handleSignin,
  handleGetUsers,
  handleSecret,
} = require("./v1");

router.get("/", homePage);
router.post("/signup", handleSignup);
router.post("/signin", basicAuth, handleSignin);
router.get("/users", bearerAuth, permissions("delete"), handleGetUsers);
router.get("/secret", bearerAuth, handleSecret);

router.param("model", (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next("Invalid Model");
  }
});

router.get("/api/v1/:model", handleGetAll);
router.get("/api/v1/:model/:id", handleGetOne);
router.post("/api/v1/:model", handleCreate);
router.put("/api/v1/:model/:id", handleUpdate);
router.delete("/api/v1/:model/:id", handleDelete);
router.get("/api/v2/:model", bearerAuth, handleGetAll);
router.get("/api/v2/:model/:id", bearerAuth, handleGetOne);
router.post("/api/v2/:model", bearerAuth, permissions("create"), handleCreate);
router.put(
  "/api/v2/:model/:id",
  bearerAuth,
  permissions("update"),
  handleUpdate
);
router.delete(
  "/api/v2/:model/:id",
  bearerAuth,
  permissions("delete"),
  handleDelete
);

module.exports = router;
