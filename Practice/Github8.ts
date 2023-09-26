import axios from "axios";
import http, { IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import path from "path";

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    res.setHeader("content-type", "Application/JSON");

    let holder = "";
    let status = 404;
    let response = {
      message: "Failed",
      data: null,
      success: false,
    };

    req
      .on("data", (chunk) => {
        holder += chunk;
      })
      .on("end", async () => {
        const { method, url } = req;
        if (method === "POST" && url === "/") {
          const input = JSON.parse(holder);
          const { username } = input;

          if (!input || !username) {
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
              fs.createWriteStream(path.join(__dirname, "./Avatar", "8.jpg"))
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
  console.log("😯");
});
