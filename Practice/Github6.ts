import axios from "axios";
import fs from "fs";
import http, { IncomingMessage, ServerResponse } from "http";
import path from "path";

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    res.setHeader("content-type", "Appication/JSON");

    let holder = "";
    let status = 404;

    let response = {
      message: "Failed",
      data: null,
      success: false,
    };

    const { method, url } = req;

    req
      .on("data", (chunk) => {
        holder += chunk;
      })
      .on("end", async () => {
        if (method === "POST" && url === "/") {
          const input = JSON.parse(holder);
          const { username } = input;

          if (!username && !input) {
            res.write(JSON.stringify({ response, status }));
            res.end();
          }
          const Git = await axios.get(
            `https://api.github.com/users/${username}`
          );

          if (Git.status) {
            const avatarUrl = Git.data.avatar_url;

            const getAvatar = await axios.get(avatarUrl, {
              responseType: "stream",
            });

            getAvatar.data.pipe(
              fs.createWriteStream(path.join(__dirname, "./Avatar", "6.jpg"))
            );
            response.data = Git.data;
            res.write(JSON.stringify({ response, status }));
            res.end();
          } else {
            res.write(JSON.stringify({ response, status }));
            res.end();
          }
        } else {
          res.write(JSON.stringify({ response, status }));
          res.end();
        }
      });
  }
);

server.listen(4000, () => {
  console.log("😮");
});
