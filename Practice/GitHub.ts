import axios from "axios";
import http, { IncomingMessage, ServerResponse } from "http";
import path from "path";
import fs from "fs";
const port: number = 4000;

interface iMessage {
  message: string;
  success: boolean;
  data: null | {}[] | [];
}

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    res.setHeader("content-type", "application/JSON");
    const { method, url } = req;
    let status = 404;

    const response: iMessage = {
      message: "failed to get",
      success: false,
      data: null,
    };

    let gitContain: string = "";

    req
      .on("data", (chunk) => {
        gitContain += chunk;
      })
      .on("end", async () => {
        if (method === "POST" && url === "/getGit") {
          const input = JSON.parse(gitContain);
          const { username } = input;

          if (!username || input === false) {
            response.message = "Invalid input";
            res.write(JSON.stringify({ status, response }));
            res.end();
          }

          const access = await axios.get(
            `https://api.github.com/users/${username}`
          );
          if (access.status) {
            const userDetails = access.data;
            const userAvatar = userDetails.avatar_url;
            const avatarFileName = `${username}avatar.jpg`;
            const avatarFolder = path.join(__dirname, "juju", avatarFileName);
            const avatarUrl = await axios.get(`${userAvatar}`, {
              responseType: "stream",
            });

            avatarUrl?.data?.pipe(fs.createWriteStream(avatarFolder));

            status = 200;
            response.message = `${username} Github details gotten`;
            response.success = true;
            response.data = userDetails;
            res.write(JSON.stringify({ response, status }));
            res.end();
          } else {
            response.message = "Not found";
            res.write(JSON.stringify({ response, status }));
            res.end();
          }
        } else {
          res.write(JSON.stringify({ status, response }));
          res.end();
        }
      });
  }
);

server.listen(port, () => {
  console.log("Running 😀");
});
