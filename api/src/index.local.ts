import app from "./index";

const port = process.env["PORT"];
const server = () => {
  app.listen(port || 8000, () =>
    console.log(`App is listening on port ${port ?? 8000}.`)
  );
};

server();

export default server;
