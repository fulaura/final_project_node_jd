const mongoose = require('mongoose');
const nodeMailer = require('nodemailer');

const mongoUri = 'mongodb://localhost:27017/fin_proj_profile';

const accounts = new mongoose.Schema({
    registered: { type: Date, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    walletadr: { type: String, required: true },
    fname: { type: String, required: true },
    sname: { type: String, required: true },
    bday: { type: Date, required: true },
    role: { type: String, default: 'user' },
});

const news = new mongoose.Schema({
    headline: { type: String, required: true },
    url: { type: String, required: true },
    photo: { type: String, required: false },
    created: { type: Date, required: true },
})

const profiles = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    posted: { type: Date, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    photos: [{ type: Buffer, required: false, maxlength: 3 }],
});

const Account = mongoose.model('Account', accounts, 'accounts');
const News = mongoose.model('News', news, 'fulaura_news');
const Profiles = mongoose.model('Profiles', profiles, 'profile');

async function connectMongoDB() {
    try {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

async function addAccount(username, password, walletadr, fname, sname, bday) {
    const newAccount = new Account({
        registered: new Date(),
        username: username,
        password: password,
        walletadr: walletadr,
        fname: fname,
        sname: sname,
        bday: bday,
    });

    try {
        const savedAccount = await newAccount.save();
        console.log('Account saved with ID:', savedAccount._id);
        nodeMailer.createTransport({
            
        })
    } catch (error) {
        console.error('Error saving account:', error);
    }
}

async function addNews(headline, url, photo) {
    const newNews = new News({
        headline: headline,
        url: url,
        photo: photo,
        created: new Date(),
    });

    try {
        const savedNews = await newNews.save();
        console.log('News saved with ID:', savedNews._id);
    } catch (error) {
        console.error('Error saving news:', error);
    }
}


async function getAccount(username) {
    const account = { found: false };
    try {
        const account = await Account.findOne({ username: username });
        console.log('Account found:', account._id);
        account.found = true;
        return account;
    } catch (error) {
        return account;
    }
}

async function username_pass_checker(username, password) {
    try {
        const account = await Account.findOne({ username: username });
        if (account && account.password === password) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking username and password:', error);
        return false;
    }
}
async function AllAccounts() {
    try {
        const accounts = await Account.find();
        return accounts;
    } catch (error) {
        console.error('Error getting all accounts:', error);
        return [];
    }
}

async function replaceOldestNews(headline, url, photo) {
    try {
        const newsCount = await News.countDocuments();
        if (newsCount >= 4) {
            const oldestNews = await News.findOne().sort({ created: 1 });
            if (oldestNews) {
                await News.deleteOne({ _id: oldestNews._id });
                console.log('Oldest news deleted with ID:', oldestNews._id);
            }
        }
        await addNews(headline, url, photo);
    } catch (error) {
        console.error('Error deleting oldest news:', error);
    }
}

async function getAllNews() {
    try {
        const newsList = await News.find().sort({ created: -1 });
        return newsList;
    } catch (error) {
        console.error('Error retrieving news:', error);
        return [];
    }
}

async function delete_news(url) {
    try {
        const deletedNews = await News.findOneAndDelete({ url: url });
        if (deletedNews) {
            console.log('News deleted with ID:', deletedNews._id);
            return true
        } else {
            console.log('No news found with the given URL.');
            return false;
        }
    } catch (error) {
        console.error('Error deleting news:', error);
    }
    
}





async function replace_or_add_profile(name, email, username, title, description, photos) {
        try {
            const existingProfile = await Profiles.findOne({ username: username });
            if (existingProfile) {
                existingProfile.name = name;
                existingProfile.email = email;
                existingProfile.title = title;
                existingProfile.description = description;
                existingProfile.photos = photos;
                await existingProfile.save();
                console.log('Profile updated with ID:', existingProfile._id);
            } else {
                const newProfile = new Profiles({
                    name: name,
                    email: email,
                    username: username,
                    posted: new Date(),
                    title: title,
                    description: description,
                    photos: photos,
                });
                const savedProfile = await newProfile.save();
                console.log('Profile added with ID:', savedProfile._id);
            }
        } catch (error) {
            console.error('Error replacing or adding profile:', error);
        }
}

async function deleteProfile(id) {
    try {
        const deletedProfile = await Profiles.findOneAndDelete({ _id: id });
        if (deletedProfile) {
            console.log('Profile deleted with ID:', deletedProfile._id);
            return true;
        } else {
            console.log('No profile found with the given username.');
            return false;
        }
    } catch (error) {
        console.error('Error deleting profile:', error);
    }
}

async function getProfile(username) {
    try {
        const profile = await Profiles.findOne({ username: username });
        if (profile) {
            profile.photos = profile.photos.map(photo => photo.buffer.toString('base64'));
            //console.log(profile.photos);
            return profile;
        } else {
            console.log('No profile found with the given username.');
            return false;
        }
    } catch (error) {
        console.error('Error getting profile:', error);
    }
}

async function modifyProfile(username, field, value) {
    try {
        const profile = await Profiles.findOne({ username: username });
        if (profile) {
            profile[field] = value;
            await profile.save();
            console.log('Profile updated with ID:', profile._id);
        } else {
            console.log('No profile found with the given username.');
        }
    } catch (error) {
        console.error('Error modifying profile:', error);
    }
    
}
async function insertPhotos(username, photos) {
    try {
        const profile = await Profiles.findOne({ username: username });
        if (!profile) {
            throw new Error('Profile not found');
        }

        profile.photos = profile.photos.concat(photos);
        await profile.save();
        console.log('Photos updated for username:', username);
        return profile;
    } catch (error) {
        console.error('Error updating photos:', error);
        throw error;
    }
}
async function AllProfiles() {
    try {
        const profiles = await Profiles.find();
        return profiles;
    } catch (error) {
        console.error('Error getting all profiles:', error);
        return [];
    }
}
async function changeRole(username, role) {
    try {
        const account = await Account.findOne({ username: username });
        if (account) {
            account.role = role;
            await account.save();
            console.log('Role updated for username:', username);
            return true;
        } else {
            console.log('No account found with the given username.');
            return false;
        }
    } catch (error) {
        console.error('Error changing role:', error);
        return false;
    }
}

module.exports = {addAccount, connectMongoDB, getAccount, username_pass_checker, 
    replaceOldestNews, getAllNews, replace_or_add_profile, deleteProfile, 
    getProfile, modifyProfile, insertPhotos, delete_news, AllAccounts, AllProfiles,
    changeRole};