import axios from "axios";
import http, { IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import path from "path";

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    res.setHeader("content-type", "Application/JSON");

    const { method, url } = req;
    let status = 404;

    let response = {
      message: "Failed",
      data: null,
      success: false,
    };

    let holder = "";
    req
      .on("data", (chunk) => {
        holder += chunk;
      })
      .on("end", async () => {
        if (method === "POST" && url === "/") {
          const input = JSON.parse(holder);
          const { username } = input;
          if (!username && !input) {
            res.write(JSON.stringify({ response }));
            res.end();
          }
          const Git = await axios.get(
            `https://api.github.com/users/${username}`
          );
          if (Git.status) {
            const avatar = Git.data.avatar_url;

            const getAvatar = await axios.get(avatar, {
              responseType: "stream",
            });

            getAvatar.data.pipe(
              fs.createWriteStream(path.join(__dirname, "./Avatar", "5.jpg"))
            );

            response.data = Git.data;
            res.write(JSON.stringify({ response }));
            res.end();
          }
        }
      });
  }
);

server.listen(4000, () => {
  console.log("😯");
});
