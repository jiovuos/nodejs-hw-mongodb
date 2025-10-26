import { Contact } from "../models/Contact.js";

export const getContacts = async (options = {}) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = "name",
    sortOrder = "asc",
    type,
    isFavourite
  } = options;

  const pageNum = Math.max(1, Number(page) || 1);
  const perPageNum = Math.max(1, Number(perPage) || 10);

  const skip = (pageNum - 1) * perPageNum;

  const sortDirection = sortOrder === "desc" ? -1 : 1;
  const sort = { [sortBy]: sortDirection };

  const filter = {};
  if (type) {
    filter.contactType = type;
  }
  if (typeof isFavourite !== "undefined") {
    if (isFavourite === "true" || isFavourite === "false") {
      filter.isFavourite = isFavourite === "true";
    } else if (typeof isFavourite === "boolean") {
      filter.isFavourite = isFavourite;
    }
  }

  const totalItems = await Contact.countDocuments(filter);
  const data = await Contact.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(perPageNum);

  const totalPages = Math.ceil(totalItems / perPageNum) || 1;

  return {
    data,
    page: pageNum,
    perPage: perPageNum,
    totalItems,
    totalPages,
    hasPreviousPage: pageNum > 1,
    hasNextPage: pageNum < totalPages
  };
};

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const createContact = async (data) => {
  return await Contact.create(data);
};

export const updateContact = async (id, data) => {
  return await Contact.findByIdAndUpdate(id, data, { new: true });
};

export const deleteContact = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
