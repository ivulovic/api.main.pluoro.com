const router = require("express-promise-router")();
const { validateBody, validateParams } = require("../../helpers/route.helper");
const TopicController = require("../../controllers/classroom/topic.controller");
const tokenMiddleware = require("../../middlewares/token.middleware");
const schema = require("../../schemas/classroom/topic.schema");
const commonSchema = require("../../schemas/common.schema");

router.use(tokenMiddleware)

router.route("/")
  .post([validateBody(schema.create)], TopicController.create);

router.route("/:id")
  .get([validateParams(commonSchema.objectId, "id")], TopicController.info)
  .delete([validateParams(commonSchema.objectId, "id")], TopicController.remove)
  .patch([validateParams(commonSchema.objectId, "id"), validateBody(schema.update)], TopicController.update);


module.exports = router;
