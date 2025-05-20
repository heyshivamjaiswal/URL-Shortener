const express = require("express");
const path = require('path');
const cookieParser = require("cookie-parser");
const {connectToMongoDB} = require("./connect")
const { restrictToLoggedInUserOnly , checkAuth} = require('./middleware/auth')
const URL = require('./models/url')

const urlRoute = require('./routes/url')
const staticRoute = require("./routes/staticRouter")
const userRoute = require('./routes/user')

const app = express();
const PORT = 8002;

connectToMongoDB('mongodb+srv://shivam364:12345@cluster0.ievu8.mongodb.net/shorturl')
.then(()=>console.log("Mongodb connected"))


app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser())

app.use("/url",  restrictToLoggedInUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/",checkAuth, staticRoute);

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: { timestamp: Date.now() }
            }
        },
        { new: true } // This returns the updated document
    );

    if (!entry) {
        return res.status(404).send('Short URL not found');
    }

    res.redirect(entry.redirectURL);
});

app.listen(PORT, ()=>console.log(`Server started at PORT:${PORT}`))