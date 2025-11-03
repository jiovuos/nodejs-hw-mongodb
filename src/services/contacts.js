import { Contact } from "../models/Contact.js";

export const getContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortBy = "name",
  sortOrder = "asc",
  type,
  isFavourite,
} = {}) => {
  if (!userId) {
    return {
      data: [],
      page: 1,
      perPage,
      totalItems: 0,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  }

  const pageNum = Math.max(1, Number(page));
  const perPageNum = Math.max(1, Number(perPage));
  const skip = (pageNum - 1) * perPageNum;

  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const filter = { userId };

  if (type) filter.contactType = type;
  if (typeof isFavourite !== "undefined")
    filter.isFavourite = isFavourite === "true";

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
    hasNextPage: pageNum < totalPages,
  };
};

export const getContactById = async (id, userId) =>
  Contact.findOne({ _id: id, userId });

export const createContact = async (data) => Contact.create(data);

export const updateContact = async (id, userId, data) =>
  Contact.findOneAndUpdate({ _id: id, userId }, data, { new: true });

export const deleteContact = async (id, userId) =>
  Contact.findOneAndDelete({ _id: id, userId });
