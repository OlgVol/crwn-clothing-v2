const express = require("express");
const path = require("path");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Post = require("./models/post");
const Contact = require("./models/contacts");
const methodOverride = require('method-override')

const app = express();
app.set("view engine", "ejs");

// Please write to contact information for MongoBD
const userName = ''
const pass = ''

const PORT = 3000;
const db =
  `mongodb+srv://${userName}:${pass}@cluster0.x3vtdbb.mongodb.net/project2?retryWrites=true&w=majority`;
mongoose
  .connect(db)
  .then((res) => console.log("Connected"))
  .catch((error) => console.log(error));

const createPath = (page) =>
  path.resolve(__dirname, "ejs-views", `${page}.ejs`);

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(express.urlencoded({ extended: false }));

app.use(express.static("styles"));

app.use(methodOverride('_method'))

// app.get("/", (req, res) => {
//   const title = "Posts";
//   res.status(202);
//   res.render(createPath("posts"), { title });
// });
app.get("/contacts", (req, res) => {
  const title = "Contacts";
  Contact.find()
    .then((contacts) => res.render(createPath("contacts"), { contacts, title }))
    .catch((error) => {
      console.log(error);
      res.render(createPath("error"), { title: "Error" });
    });
});
app.post("/add-post", (req, res) => {
  const { title, author, text } = req.body;
  const post = new Post({ title, author, text });
  post
    .save()
    .then((result) => res.redirect('/'))
    .catch((error) => {
      console.log(error);
      res.render(createPath("error"), { title: "Error" });
    });
});
app.get("/add-post", (req, res) => {
  const title = "Add post";
  res.status(202);
  res.render(createPath("add-post"), { title });
});
app.get("/posts/:id", (req, res) => {
  const title = "Post";
  Post
  .findById(req.params.id)
    .then((post) => res.render(createPath("post"), { post, title }))
    .catch((error) => {
      console.log(error);
      res.render(createPath("error"), { title: "Error" });
    });
});
app.delete("/posts/:id", (req, res) => {
    const title = "Post";
    Post
    .findByIdAndDelete(req.params.id)
      .then((post) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log(error);
        res.render(createPath("error"), { title: "Error" });
      });
  });

app.get("/", (req, res) => {
  const title = "Posts";
  Post
  .find()
  .sort({createdAt: -1})
.then((posts) => res.render(createPath("posts"), { posts, title }))
    .catch((error) => {
      console.log(error);
      res.render(createPath("error"), { title: "Error" });
    });
});

app.get("/edit/:id", (req, res) => {
    const title = 'Edit Post';
    Post
    .findById(req.params.id)
      .then((post) => res.render(createPath("edit-post"), { post, title }))
      .catch((error) => {
        console.log(error);
        res.render(createPath("error"), { title: "Error" });
      });
  });
  app.put("/edit/:id", (req, res) => {
    const {title, author, text} = req.body;
    const { id } = req.params;
    Post
    .findByIdAndUpdate(id, {title, author, text})
      .then(result => res.redirect(`/${id}`))
      .catch((error) => {
        console.log(error);
        res.render(createPath("error"), { title: "Error" });
      });
  });

app.get("about-us", (req, res) => {
  res.redirect("/contacts");
});
app.use((req, res) => {
  const title = "Error";
  res.status(404);
  res.render(createPath("error"), { title });
});
