const express = require('express')
const session = require('express-session')
const cors  = require('cors')
const helmet =  require('helmet')
const multer = require('multer');
// const crypto = require('crypto');
const app = express();
const db = require('./dbconfig')
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors())
app.use(helmet())
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
    }))

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})


const auth = (req, res, next) => {
    if (req.session.userId) {
      next();
    } 
    else {
      res.redirect('/login');
    }
  };

app.get("/"), async(req,res)=> {
    try {
        res.render('root'); 
    }
    catch(err) 
    {
        console.error(err)
    }
}

app.get("/home", auth, async(req,res)=> {
    try {
        const data = await db('data')
        res.render('home', { data }); 
        // console.log(data)
    }
    catch(err) {
        console.error(err)
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db('users').where({ username }).first();
        if (!user || !await bcrypt.compare(password, user.password)) {
            res.json({ success: false, message: 'Invalid username or password' });
            // res.send('Invalid username or password');
            // console.log('invalid')
        } 
        else {
            req.session.userId = user.id;
            res.json({ success: true });
            // res.redirect('/home');
        }
    } 
    catch (err) {
        console.error(err);
    }
});

app.post('/register', async (req, res) => {
    // console.log(req.body)
    const { username, password } = req.body;

    try {
        const userexists = await db('users').where({ username }).first();
        if (userexists) {
            return res.json({ success: false, message: 'User already exists' });
        }

        const hashedpasswrd = await bcrypt.hash(password, 10);
        await db('users').insert({
            username,
            password: hashedpasswrd
        });

        // res.redirect('/login');
        res.json({ success: true });
    } catch (error) {
        console.error(error);
    }
});

app.post('/signout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});


app.post('/add', auth, upload.single('image'), async (req, res) => {
    // console.log(req.body); 
    // console.log(req.file);

    const { house_name, place, sqft, bedrooms, rooms, price,phone } = req.body;
    const image = req.file.buffer; 

    try {
        await db('data').insert({
            image: image,
            house_name: house_name,
            place: place,
            sqft: sqft,
            bedrooms: bedrooms,
            rooms: rooms,
            price: price,
            phone:phone
        });
        res.redirect('/home');

    } catch (err) {
        console.error(err.message);
    }
});

app.delete('/delete/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        await db('data').where({ id }).del();
        console.log(id)
        console.log('deleted')
        res.json({ success: true, message: `Item deleted.` });
    } catch (err) {
        console.error(err);
    }
});

app.post('/edit/:id', auth, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { house_name, place, price, sqft, bedrooms, rooms,phone } = req.body;
    
    try {
        let data = {};
        if (house_name) data.house_name = house_name;
        if (place) data.place = place;
        if (price) data.price = price;
        if (phone) data.phone = phone;
        if (sqft) data.sqft = sqft;
        if (bedrooms) data.bedrooms = bedrooms;
        if (rooms) data.rooms = rooms;
        if (req.file) {
            data.image = req.file.buffer;
        }

        await db('data').where({ id }).update(data);
        
        res.redirect('/home');
    } catch (err) {
        console.error(err);
    }
});




app.get("/views", async(req,res)=> {
    try {
        const data = await db('data')
        res.json(data)
    }
    catch(err) {
        console.error(err)
    }
})

app.use(express.static('public'))

app.set('view engine', 'ejs')

app.use("", require("../routes/routes"))

module.exports = app;