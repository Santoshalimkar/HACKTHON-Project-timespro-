const User = require('../models/mainschema.js');
const secret = 'pavan'; 
const cron = require('node-cron');
const nodemailer = require('nodemailer');




const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.Registeruser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      dateOfBirth: req.body.DOB,
      pensionAccountNumber: req.body.accountNumber,
      contactInformation: req.body.contact,
      lifeCertificate: req.body.lifecertificate,
      aadharNumber: req.body.aadharNumber,
      photo: req.body.photos,
      signature: req.body.signatures,
      state: req.body.selectedState,
      district: req.body.district,
      isFamilyPensioner: req.body.pensionerType
    });

    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User created successfully', userId: savedUser._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



module.exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ _id: user._id,name:user.name},secret);

    res.status(200).json({ message: 'Logged in successfully', token: token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



module.exports.Updateuser=async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        dateOfBirth: req.body.dateOfBirth,
        pensionAccountNumber: req.body.pensionAccountNumber,
        contactInformation: req.body.contactInformation,
        lifeCertificate: req.body.lifeCertificate,
        aadharNumber: req.body.aadharNumber,
        photo: req.body.photo,
        signature: req.body.signature,
        state: req.body.state,
        district: req.body.district,
        isFamilyPensioner: req.body.isFamilyPensioner
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}



module.exports.getUserdetails= async (req,res)=>{
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }

}





module.exports.Uploadcertificate= async (req,res)=>{
  const id = req.params.id;

  User.findById(id)
    .then(user => {
      if (user) {
        if (req.body) {
          user.lifeCertificate = req.body.lifeCertificate;
        }
        user.hasUploadedLifeCertificate = true;
        user.save()
          .then(() => {
            res.status(200).json({ message: 'Life certificate uploaded successfully.' });
          })
          .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while saving the user object.' });
          });
      } else {
        res.status(404).json({ error: 'User not found.' });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while finding the user.' });
    });
}






module.exports.hasUploadcertificate = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.params.id});

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.hasUploadedLifeCertificate) {
      return res.status(400).json({ message: 'NOTUPLOAD' });
    }

    return res.status(200).json({ message: 'Life certificate uploaded' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


































































// create a transport for sending email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// define a cron job that runs every day at 12:00 AM
cron.schedule('0 0 * * *', async () => {
  const currentMonth = new Date().getMonth();
  if (currentMonth === 10) { // November (month index is zero-based)
    const users = await User.find({ isFamilyPensioner: true });
    for (const user of users) {
      if (!user.lifeCertificate) {
        // send a notification email to the user
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Reminder to submit life certificate',
          text: 'Dear pensioner, you have not submitted your life certificate. Please do so as soon as possible.',
        };
        await transporter.sendMail(mailOptions);
      }
    }
  }
});
