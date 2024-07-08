const express = require('express');
const router = express.Router();
const User = require('../config/models/User')
const passport = require('passport')

const bcrypt = require('bcryptjs');

router.get('/login', (req, res) => {
  res.render('login')
})


router.get('/register', (req, res) => {
  res.render('register')
})


router.post('/register', async (req, res) => {

  const { name, email, password1, password2 } = req.body

  //Busca errores en el formulario

  let errors = []

  try {
    const user = await User.findOne({ email: email })
    if(user) {
      errors.push({ msg: `El correo ${email} ya se encuentra registrado` })
      console.log(errors)
      } else {
        if (!name || !email || !password1 || !password2) {
          errors.push({ msg: 'Debes ingresar todos los campos' })
        } else if (password1 != password2) {
          errors.push({ msg: 'Las claves no coinciden' });
        } else if (password1.length < 6 || password2.length < 6){
          errors.push({ msg: 'La contraseña debe contener al menos 6 caracteres' })
        }
      }

    if (errors.length > 0) {
      return res.render('register', { errors })
    }

    //Registra nuevo usuario y hashea la contraseña
 
    const newUser = new User({
      name: name,
      email: email,
      password: password1})
    
    await bcrypt.hash(newUser.password, 10, function(err, hash) {
      if(err) throw err;
      newUser.password = hash;

      newUser.save();
      console.log(`Usuario registrado: ${newUser}`)
      const success = 'Usuario registrado. Ya puedes loguearte'
      res.render('login', { success })      
    })
  } catch (err) {
    console.log('Error al registrar el usuario', err)
  }
})


  

  

//Login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//Logout handle
router.get('/logout', (req, res, next) =>{
  req.logout((err) => {
    return next(err)
  });
  req.flash('success_msg', 'Has terminado la sesión');
  res.redirect('/users/login')
})


module.exports = router;