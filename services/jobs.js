const getJobs = async () => {
  const response = await fetch("./data.json");
  return response.json();
};

export { getJobs };
