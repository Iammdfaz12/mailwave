// Importing Libraries
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
require("dotenv").config();

// Middlewares
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection

const dbUri = process.env.DATABASE_URI;
mongoose
  .connect(`${dbUri}`)
  .then(() => {
    console.log("Database is connected...");
  })
  .catch(() => {
    console.log("Database is not connected...");
  });

// Creating MongoDB Schema

const userCredentialsSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const userCredentialsModel = mongoose.model(
  "mailwave_credential",
  userCredentialsSchema,
  "mailwave_credential"
);

app.post("/sendemail", (req, res) => {
  const senderName = req.body.senderName;
  const fromEmail = req.body.fromEmail;
  const toEmail = req.body.toEmail;
  const subject = req.body.subject;
  const emailContent = req.body.emailMessage;
  console.log(senderName, fromEmail, toEmail, subject, emailContent);

  // Get the data from DB
  userCredentialsModel
    .find()
    .then((dbData) => {
      const email = dbData[0].email;
      const password = dbData[0].password;
      console.log(email, password);

      // Nodemailer Funtion to send mail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: email,
          pass: password,
        },
      });
      new Promise(async (resolve, reject) => {
        try {
          for (var i = 0; i < toEmail.length; i++) {
            await transporter.sendMail({
              from: `'"${senderName}" <${fromEmail}>'`,
              to: toEmail[i],
              subject: subject,
              text: emailContent,
            });
            console.log("Email sent to: " + toEmail[i]);
          }
          resolve("Success");
        } catch (error) {
          reject("Error in sending mail");
        }
      })
        .then(() => {
          res.send(true);
        })
        .catch(() => {
          res.send(false);
        });
    })
    .catch((error) => {
      console.error(error);
    });
});

// Starting Server
app.listen(3000, () => {
  console.log("Server is running...");
});
