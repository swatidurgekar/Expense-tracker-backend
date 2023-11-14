import { useEffect, useState } from "react";
import "../css/downloads.css";
import axios from "axios";

const Downloads = () => {
  const token = localStorage.getItem("token");
  const [downloads, setDownloads] = useState({});

  useEffect(() => {
    const getDownloads = async () => {
      const response = await axios.get(
        "http://13.51.234.248:3001/expense/get-download",
        {
          headers: { Authorization: token },
        }
      );
      if (response) {
        const downloads = response.data.downloads;
        const updatedDownloads = downloads.map((download) => {
          const date = new Date(download.createdAt);
          const day = date.getDate();
          const month = date.getMonth();
          const year = date.getFullYear();
          download.date = `${day}-${month}-${year}`;
          return download;
        });
        const finalDownloads = updatedDownloads.reduce((acc, curr) => {
          if (acc[curr.date]) {
            acc[curr.date].push(curr.url);
          } else {
            acc[curr.date] = [curr.url];
          }
          return acc;
        }, {});
        setDownloads(finalDownloads);
      }
    };
    getDownloads();
  }, [token]);

  return (
    <div className="downloads">
      <header>Downloads</header>
      <main className="main">
        <div>
          {Object.keys(downloads).map((download) => {
            return (
              <div key={download}>
                <div>{download}</div>
                <div className="url">
                  {downloads[download].map((ele) => {
                    return (
                      <a href={ele} key={ele}>
                        {ele.slice(0, 70) + "..."}
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Downloads;
