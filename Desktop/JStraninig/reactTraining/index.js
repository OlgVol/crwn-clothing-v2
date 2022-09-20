import express from "express";
import mongoose from "mongoose";
import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";
import checkAuthor from "./utils/checkAuthor.js"
import * as  UserControler from "./controllers/UserControler.js";
import * as PostControler from "./controllers/PostController.js"
import multer from "multer"
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose
  .connect(
    "mongodb+srv://OlgaVo:pass321@cluster0.4oyrd1r.mongodb.net/TrainingProject?retryWrites=true&w=majority"
  )
  .then(() => console.log("conected to DB"))
  .catch(() => console.log("DB error"));

const app = express();
const PORT = 3001;

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
cb(null, 'uploads');
    },
    filename:(_, file, cb) => {
        cb(null, file.originalname);
    },
})

const upload = multer ({ storage })

app.use(express.json());
app.use('/uploads', express.static('uplaods'))

app.post("/auth/login",loginValidation, handleValidationErrors,UserControler.login);

app.post("/auth/register",registerValidation,handleValidationErrors ,UserControler.register);

app.get('/auth/me', checkAuthor, UserControler.getMe)

app.post('/upload', checkAuthor, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.get('/posts', PostControler.getAll)
app.get('/posts/:id', PostControler.getOne)
app.post('/posts',checkAuthor, postCreateValidation, handleValidationErrors,  PostControler.create)
app.delete('/posts/:id',checkAuthor, PostControler.remove)
app.patch('/posts/:id',checkAuthor, handleValidationErrors, PostControler.update)

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`Server started on ${PORT}`);
});
