const UserServices = require("../services/userservices");
const S3Service = require("../services/S3services");
const DownloadService = require("../services/downloadservices");

exports.downloadExpense = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const expenses = await UserServices.getExpenses(req);
    const stringifiedExpenses = JSON.stringify(expenses);
    //filenames should depend on userid
    const fileName = `Expense${userId}/${new Date()}.txt`;
    const fileURL = await S3Service.uploadToS3(stringifiedExpenses, fileName);
    DownloadService.setDownloads(req, fileURL);
    res.status(200).json({ fileURL, success: true });
  } catch (err) {
    res.status(500).json({ fileURL: "", success: false, err: err.message });
  }
};

exports.getDownloadExpenses = async (req, res, next) => {
  const downloads = await DownloadService.getDownloads(req);
  if (downloads) {
    res.status(200).json({ downloads });
  }
};
