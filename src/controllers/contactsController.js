import createHttpError from "http-errors";
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
} from "../services/contacts.js";

export const getAllContactsController = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = "name",
      sortOrder = "asc",
      type,
      isFavourite
    } = req.query;

    const userId = req.user?.userId || req.user?.id || null;

    const result = await getContacts({
      userId,
      page: Number(page),
      perPage: Number(perPage),
      sortBy,
      sortOrder,
      type,
      isFavourite
    });

    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user?.userId || req.user?.id || null;

    const contact = await getContactById(contactId, userId);

    if (!contact) {
      throw createHttpError(404, "Contact not found");
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id || null;
    const payload = { ...req.body, userId };

    const newContact = await createContact(payload);

    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: newContact
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user?.userId || req.user?.id || null;

    const updated = await updateContact(contactId, userId, req.body);

    if (!updated) {
      throw createHttpError(404, "Contact not found");
    }

    res.status(200).json({
      status: 200,
      message: "Successfully patched a contact!",
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user?.userId || req.user?.id || null;

    const deleted = await deleteContact(contactId, userId);

    if (!deleted) {
      throw createHttpError(404, "Contact not found");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
