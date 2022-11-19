if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const bodyParser = require('body-parser')
const axios = require('axios')

const methodOverride = require('method-override')
const asyncError = require('./utilities/asyncError')
const ExpressError = require('./utilities/ExpressError')



const { apiFetch } = require('./apiFetch')
// const Date = require('./public/date')
const Watchbag = require('./models/watchbag')
const Show = require('./models/show')

const session = require('express-session')
const flash = require('connect-flash')

const dragndropRoutes = require('./routes/dragndropRoutes')
const mywatchbagRoutes = require('./routes/mywatchbagRoutes')


const mongoose = require('mongoose');
const { watch } = require('./models/watchbag');
const watchbag = require('./models/watchbag');

mongoose.connect('mongodb+srv://suyash:demon@watchbag.cxrz0jz.mongodb.net/WatchBag?retryWrites=true&w=majority', () => {
    console.log('Database Connected');
});


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))


const sessionConfig = {
    secret: 'yedpmaiaaphomashaallah',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + (1000*60*60*24*7),
        maxAge: 1000*60*60*24*7

    }
}
app.use(session(sessionConfig));
app.use(flash());


app.use( ( req, res, next ) => {
    res.locals.url = req.originalUrl
    // res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.warning = req.flash('warning')
    next();
})


app.get('/', ( req, res ) => {
    res.render('home');  
});

app.post('/search', asyncError( async ( req, res, next ) => {
    const weather = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.OMDB_apikey}&s=${req.body.search}&page=1-10`);
    data = weather.data;
    if( data.Error ){
        return next ( new ExpressError('Movie Not Found',404) )
    }
    res.render('search', { data })
}));

app.get('/search/:info', asyncError( async ( req, res ) => {
    const weather = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.OMDB_apikey}&i=${req.params.info}`);
    data = weather.data;
    if( data.Error ){
        return next ( new ExpressError('Movie Not Found',404) )
    }
    res.render('info', { data })
}));

app.use('/mywatchbags', mywatchbagRoutes)

app.use('/mywatchbags/:id/dnd', dragndropRoutes)

app.all('*', ( req, res, next )=> {
    next ( new ExpressError('Page Not Found',404) ) ;
})

app.use( ( err, req, res, next ) =>{
    const { statusCode = 500 , message = Boom } = err ;
    res.status(statusCode).render( 'error', { message });
})

app.listen(3000, () => {
    console.log('Serving on Port 3000');
});