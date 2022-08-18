const router = require("express-promise-router")();
const { validateBody, validateParams } = require("../../helpers/route.helper");
const SubjectController = require("../../controllers/classroom/subject.controller");
const tokenMiddleware = require("../../middlewares/token.middleware");
const schema = require("../../schemas/classroom/subject.schema");
const commonSchema = require("../../schemas/common.schema");

router
  .route("/:id")
  .get(
    [validateParams(commonSchema.email, "id")],
    SubjectController.listForUser
  );

router.use(tokenMiddleware)

router.route("/")
  .get([], SubjectController.list)
  .post([validateBody(schema.create)], SubjectController.create);

router.route("/:id")
  // .get([validateParams(commonSchema.objectId, "id")], SubjectController.findOne)
  .delete([validateParams(commonSchema.objectId, "id")], SubjectController.remove)
  .patch([validateParams(commonSchema.objectId, "id"), validateBody(schema.update)], SubjectController.update);

module.exports = router;
