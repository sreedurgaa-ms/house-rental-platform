const express = require('express')
const router = express.Router()
const db = require('../api/dbconfig');

const auth = (req, res, next) => {
    if (req.session.userId) {
      next();
    } 
    else {
      res.redirect('/login');
    }
  };

router.get("/", (req,res)=> {
    res.render('root')
})

router.get("/login", (req,res)=> {
    res.render('login', {title: 'Login'})
})

router.get("/register", (req,res)=> {
    res.render('register', {title: 'Register'})
})

router.get("/signout", (req,res)=> {
    res.render('root')
})

router.get("/home", auth, (req,res)=> {
    res.render('home', {title: 'Home'})
})

router.get("/add", auth, (req,res)=> {
    res.render('additem', {title: 'Add Item'})
})

router.get("/about", (req,res)=> {
    res.render('about', {title: 'About'})
})

router.get("/edit/:id", auth, async (req,res)=> {
    const user = await db('data').where({ id: req.params.id }).first();
    res.render('edit', { title: 'Edit', user });
})

module.exports = router;