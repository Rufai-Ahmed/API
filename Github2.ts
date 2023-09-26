import axios from "axios";
import http, { IncomingMessage, ServerResponse } from "http";
interface iMessage {
  message: string;
  success: boolean;
  data: null | {}[] | [];
}

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    res.setHeader("content-type", "Application/JSON");

    const response: iMessage = {
      message: "Failed",
      success: false,
      data: null,
    };
    let status = 404;
    let holder = "";
    const { method, url } = req;
    req
      .on("data", (chunk) => {
        holder += chunk;
      })
      .on("end", async () => {
        if (method === "POST" && url === "/") {
          const input = JSON.parse(holder);

          const { username } = input;

          if (!username || !input) {
            res.write(JSON.stringify({ response, status }));
            res.end;
          }

          const URL = await axios.get(
            `https://api.github.com/users/${username}`
          );
          if (URL.status) {
            response.data = URL.data.bio;
            res.write(JSON.stringify({ response, status }));
            res.end();
          } else {
            res.write(JSON.stringify({ response, status }));
            res.end();
          }
        }
      });
  }
);

server.listen(4000, () => {
  console.log("😋");
});
