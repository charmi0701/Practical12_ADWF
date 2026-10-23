const app = require("./app");
const port = process.env.PORT || 5003;

app.listen(port, () => {
  console.log(`Practical 12 CI API listening at http://localhost:${port}`);
});
