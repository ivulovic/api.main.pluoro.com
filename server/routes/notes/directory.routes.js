const router = require("express-promise-router")();
const { validateBody, validateParams } = require("../../helpers/route.helper");
const DirectoryController = require("../../controllers/notes/directory.controller");
const tokenMiddleware = require("../../middlewares/token.middleware");
const schema = require("../../schemas/notes/directory.schema");
const commonSchema = require("../../schemas/common.schema");

router.use(tokenMiddleware)

router.route("/")
  .get([], DirectoryController.list)
  .post([validateBody(schema.create)], DirectoryController.create);

router.route("/:id")
  .get([validateParams(commonSchema.objectId, "id")], DirectoryController.findOne)
  .delete([validateParams(commonSchema.objectId, "id")], DirectoryController.remove)
  .patch([validateParams(commonSchema.objectId, "id"), validateBody(schema.update)], DirectoryController.update);

module.exports = router;
