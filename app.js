const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const User = require("./models/user");
var cors = require("cors");

const app = express();

app.use(cors());

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.post("/user/add-user", async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const pnumber = req.body.pnumber;

    const data = await User.create({
      name: name,
      email: email,
      pnumber: pnumber,
    });
    res.status(201).json({ newUserDetail: data });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

app.get("/user/get-users", async (req, res, next) => {
  try{
  const users = await User.findAll();
  res.status(200).json({ allUsers: users });
  }catch(err){
    console.log(err)
    res.status(500).json({error:err})
  }
});

app.delete("/user/delete-user/:id", async (req, res, next) => {
  try{
  const uId = req.params.id;
  console.log(uId)
  await User.destroy({ where: { id: uId } });
  res.sendStatus(200);
  }catch(err){
    console.log(err);
  }
});

app.use(errorController.get404);

sequelize
  .sync()
  .then((result) => {
    // console.log(result);
    app.listen(3000);
  })
  .catch((err) => console.log(err));

app.listen(4000);
