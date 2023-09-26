import axios from "axios";
import http, { IncomingMessage, ServerResponse } from "http";
import path from "path";
import fs from "fs";

interface iMessage {
  message: string;
  success: boolean;
  data: {}[] | {} | [] | null;
}

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    res.setHeader("content-type", "Application/JSON");
    let holder = "";
    let status = 404;

    const response: iMessage = {
      message: "Failed",
      success: true,
      data: null,
    };

    req.on("data", (chunk) => {
      holder += chunk;
    });
    req.on("end", async () => {
      const input = JSON.parse(holder);
      const { url, method } = req;
      if (method === "POST" && url === "/") {
        const { username } = input;
        if (!username && !input) {
          res.write(JSON.stringify({ response, status }));
          res.end();
        }
        const URL = await axios.get(`https://api.github.com/users/${username}`);
        if (URL.status) {
          let everything = URL.data;
          let avatarUrl = everything.avatar_url;
          let avatarFile = `${username}.jpg`;
          const avatarFolder = path.join(__dirname, `./${username}Folder`);

          let Avatar = await axios.get(avatarUrl, { responseType: "stream" });

          Avatar.data.pipe(
            fs.createWriteStream(
              path.join(__dirname, `./AvatarFolder`, avatarFile)
            )
          );

          response.data = everything;
          res.write(JSON.stringify({ status: 200, response }));
          res.end();
        } else {
          response.message = "User not found";
          res.write(JSON.stringify({ response, status }));
          res.end();
        }
      }
    });
  }
);

server.listen(4000, () => {
  console.log("😎");
});
