const router = require("express-promise-router")();
const { validateBody, validateParams } = require("../../helpers/route.helper");
const NoteController = require("../../controllers/notes/note.controller");
const tokenMiddleware = require("../../middlewares/token.middleware");
const schema = require("../../schemas/notes/note.schema");
const commonSchema = require("../../schemas/common.schema");

router.use(tokenMiddleware)

router.route("/")
  .post([validateBody(schema.create)], NoteController.create);

// router.route("/:id/info")
//   .get([validateParams(commonSchema.objectId, "id")], NoteController.info)

router.route("/:id")
  .get([validateParams(commonSchema.objectId, "id")], NoteController.info)
  .delete([validateParams(commonSchema.objectId, "id")], NoteController.remove)
  .patch([validateParams(commonSchema.objectId, "id"), validateBody(schema.update)], NoteController.update);


module.exports = router;
