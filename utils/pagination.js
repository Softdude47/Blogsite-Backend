const pagination = async (
  schema,
  { page = 0, perPage = 10 },
  cb = undefined
) => {
  if (page < 1) throw new Error("page must be greater than or equal to 1");

  // get page documents
  page -= 1;
  const total = await schema.clone().countDocuments();
  const data = await schema
    .skip(page * perPage)
    .limit(perPage)
    .exec();

  // define next/previous page
  const nextPage = {};
  const prevPage = {};

  if (!(page <= 1)) {
    prevPage.page = page - 1;
    prevPage.perPage = perPage;
  }
  if (page >= 1 && page != total) {
    nextPage.page = page + 1;
    nextPage.perPage = perPage;
  }

  return cb ? cb({ data, prevPage, nextPage }) : { data, prevPage, nextPage };
};

export default pagination;
