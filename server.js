const express = require('express');
const MongoDB = require('./module/MongoDB');
const Encryption = require('./module/Encription');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();


const user_adress = {};
const roles = {};



const app = express();
const SECRET_KEY = process.env.SECRET_KEY;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}


app.use(express.static(path.join(__dirname, 'public')));
MongoDB.connectMongoDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// main routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registration.html'));});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));});
app.get('/walletVerify', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'WalletVerification.html'));});
app.get('/mod', (req, res) => {
    const username = req.query.username;
    if (roles[username] === 'moderator') {
        res.sendFile(path.join(__dirname, 'public', 'index_moderator.html'));
    } else if (roles[username] === 'admin') {
        res.sendFile(path.join(__dirname, 'public', 'index_admin.html'));
    } else {}
});
app.get('/news_edit', (req, res) => {
    if (roles[process.env.USERNAME] === 'user') {} else {
        res.sendFile(path.join(__dirname, 'public', 'news.html'));
    }
});
app.get('/roles_edit', (req, res) => {
    if ((roles[process.env.USERNAME] === 'user') || (roles[process.env.USERNAME] === 'moderator')) {} else {
        res.sendFile(path.join(__dirname, 'public', 'roles.html'));
    }
});
app.get('/profile_edit', (req, res) => {
    if ((roles[process.env.USERNAME] === 'user') || (roles[process.env.USERNAME] === 'moderator'))  {} else {
        res.sendFile(path.join(__dirname, 'public', 'profile.html'));
    }
});



// Login/signup routes
app.post('/register', async (req, res) => {
    const { username, password, firstName, lastName, birthDate, walletAddress } = req.body;
    const hashedPassword = await Encryption.hashPassword(password);
    response = await MongoDB.addAccount(username, hashedPassword, walletAddress, firstName, lastName, birthDate);
    res.redirect('/login');
});
app.get('/check_user', async (req, res) => {
    const response = await MongoDB.getAccount(req.query.username);
    if(response.found){
        res.status(200).json(response);
    }else{
        res.status(404).json(response);
    }
});
app.get('/signin', async (req, res) => {
    const { username, password } = req.query;
    const user = await MongoDB.getAccount(username);
    const response = await Encryption.comparePassword(password, user.password);
    //console.log(response);
    if(response){
        process.env.USERNAME = username;
        user_adress[username] = user.walletadr;
        roles[username] = user.role;
        res.status(200).json(response);
    } else{
        res.status(404).json(response);
    }
});


//2FA verification
app.post('/walletVerify', async (req, res) => {
    const { walletAddress } = req.body;
    if(user_adress[process.env.USERNAME] === walletAddress){
        const token = jwt.sign({ walletAddress }, SECRET_KEY, { expiresIn: '1h' });
        console.log(token);
        res.status(200).json({token});
        //res.status(200).json({message: 'Wallet Verified'});
    } else{
        res.status(404).json({message: 'Wallet not verified'});
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}



app.post('/protected-route', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});
app.get('/get_username', (req, res) => {
    res.json({ username: process.env.username });
});



// News routes
app.get('/news', async (req, res) => {
    const news = await MongoDB.getAllNews();
    res.status(200).json(news);
});

app.post('/add_news', async (req, res) => {
    const { headline, newsLink  , photoLink } = req.body;
    console.log(headline, newsLink, photoLink);
    await MongoDB.replaceOldestNews(headline, newsLink, photoLink);
    res.status(201).json({ message: 'News added successfully' });
});

app.delete('/delete_news', async (req, res) => {
    const { url } = req.query;
    const response = await MongoDB.delete_news(url);
    if (response) {
        res.status(200).json({ message: 'News deleted successfully' });
    } else {
        res.status(404).json({ message: 'News not found' });
    }
});


// Profile routes
app.post('/newprofile', upload.array('photos', 3), async (req, res) => {
    const { name, email, username, posted, title, description} = req.body;
    console.log(name, email, username, posted, title, description);
    const photosArray = req.photos ? req.photos.map(file => file.path) : [];

    await MongoDB.replace_or_add_profile(name, email, username, title, description, photosArray);
    res.status(201).json({ message: 'Profile created successfully' });
});

app.get('/check_profile', async (req, res) => {
    console.log(req.query.username);
    const response = await MongoDB.getProfile(req.query.username);
    if(response){
        res.status(200).json(response);
    }else{
        res.status(404).json(response);
    }
});

app.post('/uploadPhotos', upload.array('photos', 3), async (req, res) => {
    const { username } = req.body;
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }
    const photos = req.files.map(file => file.path);

    try {
        const result = await MongoDB.insertPhotos(username, photos);
        res.status(201).json({ message: 'Photos uploaded', profile: result });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading photos', error });
    }
});

app.get('/account_roles', async (req, res) => {
    const response = await MongoDB.AllAccounts();
    const filteredResponse = response.map(account => ({
        username: account.username,
        role: account.role
    }));
    res.status(200).json(filteredResponse);
});

app.get('/account_profiles', async (req, res) => {
    const response = await MongoDB.AllProfiles();
    res.status(200).json(response);
});

app.delete('/account_profiles/:id', async (req, res) => {
    const response = await MongoDB.deleteProfile(req.params.id);
    if (response) {
        res.status(200).json({ message: 'Profile deleted successfully' });
    } else {
        res.status(404).json({ message: 'Profile not found' });
    }
});
app.post('/change_role', async (req, res) => {
    const { username, role } = req.body;
    const response = await MongoDB.changeRole(username, role);
    if (response) {
        roles[username] = role;
        res.status(200).json({ message: 'Role changed successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});