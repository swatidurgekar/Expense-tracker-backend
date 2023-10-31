const Downloads = require("../models/downloadModel");

const setDownloads = async (req, fileURL) => {
  await req.user.createDownload({
    url: fileURL,
  });
};

const getDownloads = async (req) => {
  const downloads = await req.user.getDownloads();
  return downloads;
};

module.exports = { setDownloads, getDownloads };
