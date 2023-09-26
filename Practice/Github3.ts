import axios from "axios";
import http, { IncomingMessage, ServerResponse } from "http";
import path from "path";
import fs from "fs";

interface iMessage {
  message: string;
  success: boolean;
  data: null | {}[] | [];
}

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    res.setHeader("content-type", "Application/JSON");
    let holder = "";
    let status = 404;

    const response: iMessage = {
      message: "Failed",
      success: false,
      data: null,
    };
    const { url, method } = req;

    req
      .on("data", (chunk) => {
        holder += chunk;
      })
      .on("end", async () => {
        if (url === "/" && method === "POST") {
          const input = JSON.parse(holder);
          const { username } = input;
          if (!input || !username) {
            res.write(JSON.stringify({ response, status }));
            res.end();
          }

          const URL = await axios.get(
            `https://api.github.com/users/${username}`
          );

          if (URL.status) {
            const avatarUrl = URL.data.avatar_url;

            const getAvatar = await axios.get(avatarUrl, {
              responseType: "stream",
            });

            getAvatar.data.pipe(
              fs.createWriteStream(path.join("./Avatar", `3.jpg`))
            );

            response.data = URL.data;
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
  console.log("🥱");
});
