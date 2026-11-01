export const paginate = (items = [], page = 1, perPage = 10) => {
  const safePerPage = Math.max(1, Number(perPage) || 1);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safePerPage));

  const currentPage = Math.min(
    Math.max(1, Math.trunc(Number(page)) || 1),
    totalPages,
  );

  const startIndex = (currentPage - 1) * safePerPage;
  const endIndex = startIndex + safePerPage;

  return {
    data: items.slice(startIndex, endIndex),
    meta: {
      total,
      page: currentPage,
      perPage: safePerPage,
      totalPages,
      from: total === 0 ? null : startIndex + 1,
      to: total === 0 ? null : Math.min(endIndex, total),
      prevPage: currentPage > 1 ? currentPage - 1 : null,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
    },
  };
};
