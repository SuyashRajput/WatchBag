const express = require('express');
const router = express.Router();
const asyncError = require('../utilities/asyncError')
const Watchbag = require('../models/watchbag')
const Show = require('../models/show')
const { apiFetch } = require('../apiFetch')
const ExpressError = require('../utilities/ExpressError')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
// const { campgroundSchema } = require('../schemas') 
// const isLoggedin = require('../utilities/login') 


router.get('/', asyncError( async ( req, res ) => {
    const watchbags = await Watchbag.find({})
    res.render('watchbags/index', { watchbags })
}));

router.get('/new', ( req, res ) => {
    res.render('watchbags/new')
})

router.post('/', upload.single('image') , asyncError( async ( req, res ) => {
    res.send( req.body , req.file )
    // const watchbag = new Watchbag( req.body );
    // await watchbag.save();
    // req.flash('success','Awesome! New Watchbag Created')
    // res.redirect(`/mywatchbags`)
}));

router.delete('/:id', asyncError( async ( req, res ) => {
    await Watchbag.findByIdAndDelete(req.params.id);
    req.flash('success','Watchbag deleted Successfully')
    res.redirect('/mywatchbags');
}));

router.get('/:id', asyncError( async ( req, res ) => {
    const id = req.params.id
    const watchbag = await Watchbag.findById( req.params.id ).populate('showsCurrent').populate('showsWatched')
    res.render('watchbags/show', { watchbag , id })
}));

router.get('/:id/show', asyncError( async ( req, res ) => {
    const watchbag = await Watchbag.findById( req.params.id )
    res.render('watchbags/show', { watchbag })
}));

router.post('/:id', apiFetch, asyncError( async ( req, res ) => {
    const id = req.params.id;
    const watchbag = await Watchbag.findById( id )
    const show = new Show( { name: req.apiData.Title, image: req.apiData.Poster, year: req.apiData.Year } )
    watchbag.showsCurrent.push(show);
    await show.save();
    await watchbag.save();
    req.flash('success','Looks like a new item is Added!')
    res.redirect(`/mywatchbags/${id}`)
}));

module.exports = router;
