import axios from "axios";
import http, { IncomingMessage, ServerResponse } from "http";

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    res.setHeader("content-type", "Application/JSON");

    let status = 404;
    let response = {
      message: "Failed",
      data: null,
      success: true,
    };
    let holder = "";
    req
      .on("data", (chunk) => {
        holder += chunk;
      })
      .on("end", async () => {
        const { method, url } = req;
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
            response.data = Git.data;
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
  console.log("😨");
});
