import { Router } from "express";
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController
} from "../controllers/contactsController.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import {
  createContactSchema,
  updateContactSchema
} from "../validation/contactSchemas.js";

const router = Router();

router.get("/", ctrlWrapper(getAllContactsController));

router.get("/:contactId", isValidId, ctrlWrapper(getContactByIdController));

router.post(
  "/",
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);

router.patch(
  "/:contactId",
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController)
);

router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));

export default router;
