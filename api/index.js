const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()
const User = require('./models/User.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Place = require('./models/Place.js')
const cookieParser = require('cookie-parser')// to read cookies
const imageDownloader = require('image-downloader')
const app = express();
const multer = require('multer')
const bcryptSalt = bcrypt.genSaltSync(10); // this is async function as well, so genSaltSync to await
const jwtSecret = "asdfasdfasdf2wdf";
const fs = require('fs');
app.use(express.json()) // to read json
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(cors({
    credentials: true, 
    origin: 'http://localhost:5173',
}));
mongoose.connect(process.env.MONGO_URL)
app.get('/test', (req, res) => {
    res.json('test ok')
})
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userDoc = await User.create({ // this is an async function so add await, async, wait until user is created then send to DB
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    }
    catch (e) {
        res.status(422).json(e);
    }
})

// go to 1:25:00 if sth breaks down at the end
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password)
        if (passOk) {
            jwt.sign({
                email: userDoc.email,
                id: userDoc._id,
            }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            })
        }
        else {
            res.status(422).json('not ok')
        }
    }
    else {
        res.json('not found')
    }
})
app.get('/profile', (req, res) => { // at this point info is in the cookie session so we take info from there
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, id } = await User.findById(userData.id); // fetch the id and related values such as name bc our default fetch doesn't contain names.
            res.json({ name, email, id });
        })
    }
    else {
        res.json(null);
    }
})
app.post('/logout', (req, res) => { // make the token equal to empty string to logout
    res.cookie('token', '').json(true);
})
app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    })
    res.json(newName);
})
const photosMiddleware = multer({ dest: 'uploads/' }) // 3:20:00
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalName } = req.files[i];
        const parts = originalName.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads/', ''));
    }
    res.json(uploadedFiles);
})
app.post('/places', (req, res) => {
    const { token } = req.cookies;
    const { title, address, addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.create({
            owner: userData.id,//grab from our user id from our user token
            title, address, photos: addedPhotos, description,
            perks, extraInfo, checkIn, checkOut, maxGuests,
        });
        res.json(placeDoc);
    })

})
app.get('/places', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const { id } = userData;
        res.json(await Place.find({ owner: id }));
    })
})
app.get('/places/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
})
app.put('/places/:id', async (req, res) => { // 4:25, endpoint for updating the form

    const { token } = req.cookies;
    const { id, title, address, addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const placeDoc = await Place.findById(id);
    
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({ 
                title, address, photos: addedPhotos, description,
                perks, extraInfo, checkIn, checkOut, maxGuests,
            })
            await placeDoc.save();
            res.json('ok')
        }
    })
})
// 4:33:00
app.listen(4123);


