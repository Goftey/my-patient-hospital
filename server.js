require('dotenv').config();
const express = require("express");
const app = express();
const pool = require("./dbConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 4000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET:", JWT_SECRET);

function authenticateToken(req, res, next) {
  const token = req.cookies['auth-token'];
  if (!token) return res.redirect('/users/log_in');

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.redirect('/users/log_in');
    req.user = user;
    next();
  });
}

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/users/jane", (req, res) => {
  res.render("jane");
});

app.get("/users/signup", (req, res) => {
  res.render("signup", { errors: [], firstname: "", lastname: "", email: "", password: "", confirmPassword: "" });
});


app.get("/users/log_in", (req, res) => {
  res.render("log_in",{ errors: [], email: "", password: "" });
});
app.get("/users/patient", authenticateToken, (req, res) => {
  res.render("patient", { firstname: req.user.firstname, lastname: req.user.lastname });
});


app.get("/users/logout", (req, res) => {
  res.clearCookie('auth-token');
  res.redirect("/users/log_in");
});

app.post("/users/signup", async (req, res) => {
  let { firstname,lastname,email, password, confirmPassword } = req.body;

  console.log({ firstname,lastname,email, password, confirmPassword });

  let errors = [];
  if (!firstname || !lastname ||!email || !password || !confirmPassword) {
    errors.push({ message: "Please enter all fields" });
  }
  if (password.length < 6) {
    errors.push({ message: "Password should be at least 6 characters" });
  }
  if (password !== confirmPassword) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("signup", { errors,firstname, lastname,email, password, confirmPassword });
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    pool.query(
      `SELECT * FROM patients WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
        if (results.rows.length > 0) {
          errors.push({ message: "Email already exists, go to login" });
          res.render("signup", { errors, firstname, lastname, email, password, confirmPassword });
        } else {
          pool.query(
            `INSERT INTO patients (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)RETURNING id, password`,
            [firstname, lastname, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              res.redirect("/users/log_in");
            }
          );
        }
      }
    );
  }
});
app.post("/users/log_in",async (req, res) => {
  let { email, password } = req.body;

  console.log({ email, password});

  let errors = [];
  if (!email || !password) {
    errors.push({ message: "Please enter all fields" });
  }
  if (password.length < 6) {
    errors.push({ message: "Password should be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render("log_in", { errors, email, password });
  }
  pool.query(
    `SELECT * FROM patients WHERE email = $1`,
    [email],
    (err, results) => {
      if (err) {
        console.error("Database query error", err);
        errors.push({ message: "Database error. Please try again later." });
        return res.render("log_in", { errors, email, password });
      }
      if (results.rows.length === 0) {
        errors.push({ message: 'Email is not registered go to signup' });
        console.log("Email not registered ", errors);
        return res.render("log_in", { errors, email, password });
      } else {
        const user = results.rows[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.error("Bcrypt compare error", err);
            errors.push({ message: "Server error. Please try again later." });
            return res.render("log_in", { errors, email, password });
          }
          if (!isMatch) {
            errors.push({ message: "Password is incorrect" });
            console.log("Password incorrect", errors);
            return res.render("log_in", { errors, email, password });
          }
          
          const token = jwt.sign({ id: user.id, email: user.email,firstname:user.firstname}, JWT_SECRET, { expiresIn: '1h' });
          res.cookie('auth-token', token, { httpOnly: true });
          return res.redirect('/users/patient');
        });
      }
    }
  );
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




// // server.js
// const express = require("express");
// const app = express();
// const pool = require("./dbConfig"); // Import the pool instance directly
// const bcrypt = require("bcrypt");
// const session = require("express-session");
// const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");

// dotenv.config();

// const PORT = process.env.PORT || 4000;

// app.use(express.static("public"));
// app.set("view engine", "ejs");
// app.use(express.urlencoded({ extended: false }));

// app.use(session({
//   secret: 'secret',
//   resave: false,
//   saveUninitialized: false
// }));

// const JWT_SECRET = process.env.JWT_SECRET;

// // Middleware to verify JWT
// function authenticateToken(req, res, next) {
//   const token = req.cookies['auth-token'];
//   if (!token) return res.redirect('/users/log_in');

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.redirect('/users/log_in');
//     req.user = user;
//     next();
//   });
// }

// app.get("/", (req, res) => {
//   res.render("index");
// });

// app.get("/users/jane", (req, res) => {
//   res.render("jane");
// });

// app.get("/users/signup", (req, res) => {
//   res.render("signup");
// });

// app.get("/users/log_in", (req, res) => {
//   res.render("log_in");
// });

// app.get("/users/patient", authenticateToken, (req, res) => {
//   res.render("patient");
// });

// app.get("/users/logout", (req, res) => {
//   res.clearCookie('auth-token');
//   res.redirect("/users/log_in");
// });

// app.post("/users/signup", async (req, res) => {
//   let { email, password, confirmPassword } = req.body;

//   console.log({ email, password, confirmPassword });

//   let errors = [];
//   if (!email || !password || !confirmPassword) {
//     errors.push({ message: "Please enter all fields" });
//   }
//   if (password.length < 6) {
//     errors.push({ message: "Password should be at least 6 characters" });
//   }
//   if (password !== confirmPassword) {
//     errors.push({ message: "Passwords do not match" });
//   }
//   if (errors.length > 0) {
//     res.render("signup", { errors });
//   } else {
//     let hashedPassword = await bcrypt.hash(password, 10);
//     console.log(hashedPassword);

//     pool.query(
//       `SELECT * FROM patients WHERE email = $1`,
//       [email],
//       (err, results) => {
//         if (err) {
//           throw err;
//         }
//         console.log(results.rows);
//         if (results.rows.length > 0) {
//           errors.push({ message: "Email already exists, go to login" });
//           res.render("signup", { errors });
//         } else {
//           pool.query(
//             `INSERT INTO patients (email, password) VALUES ($1, $2) RETURNING id, password`,
//             [email, hashedPassword],
//             (err, results) => {
//               if (err) {
//                 throw err;
//               }
//               console.log(results.rows);
//               res.redirect("/users/log_in");
//             }
//           );
//         }
//       }
//     );
//   }
// });

// app.post("/users/log_in", (req, res) => {
//   const { email, password } = req.body;

//   pool.query(
//     `SELECT * FROM patients WHERE email = $1`,
//     [email],
//     (err, results) => {
//       if (err) {
//         throw err;
//       }
//       if (results.rows.length > 0) {
//         const user = results.rows[0];

//         bcrypt.compare(password, user.password, (err, isMatch) => {
//           if (err) {
//             throw err;
//           }
//           if (isMatch) {
//             const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
//             res.cookie('auth-token', token, { httpOnly: true });
//             res.redirect("/users/patient");
//           } else {
//             res.render('log_in', { message: 'Password is incorrect' });
//           }
//         });
//       } else {
//         res.render('log_in', { message: 'Email is not registered' });
//       }
//     }
//   );
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });







// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const session = require("express-session");
// const pool = require("./dbConfig");



// const app = express();
// const PORT = process.env.PORT || 4000;


// app.use(express.static("public"));

// app.set("view engine", "ejs");
// app.use(express.urlencoded({ extended: false }));

// app.use(session({
//   secret: 'secret',
//   resave: false,
//   saveUninitialized: false
// }));


// const JWT_SECRET = 'your_jwt_secret_key'; // Store this in an environment variable

// app.get("/", (req, res) => {
//   res.render("index");
// });

// app.get("/users/signup", (req, res) => {
//   res.render("signup");
// });

// app.get("/users/log_in", (req, res) => {
//   res.render("log_in");
// });

// app.get("/users/patient", authenticateToken, (req, res) => {
//   res.render("patient", { user: req.user });
// });


// app.post("/users/signup", async (req, res) => {
//   let { email, password, confirmPassword } = req.body;

//   console.log({ email, password, confirmPassword });

//   let errors = [];
//   if (!email || !password || !confirmPassword) {
//     errors.push({ message: "Please enter all fields" });
//   }
//   if (password.length < 6) {
//     errors.push({ message: "Password should be at least 6 characters" });
//   }
//   if (password !== confirmPassword) {
//     errors.push({ message: "Passwords do not match" });
//   }
//   if (errors.length > 0) {
//     res.render("signup", { errors });
//   } else {
//     let hashedPassword = await bcrypt.hash(password, 10);
//     console.log(hashedPassword);

//     pool.query(
//       `SELECT * FROM patients WHERE email = $1`,
//       [email],
//       (err, results) => {
//         if (err) {
//           throw err;
//         }
//         console.log(results.rows);
//         if (results.rows.length > 0) {
//           errors.push({ message: "Email already exists go to login" });
//           res.render("signup", { errors });
//         } else {
//           pool.query(
//             `INSERT INTO patients (email, password) VALUES ($1, $2) RETURNING id, password`,
//             [email, hashedPassword],
//             (err, results) => {
//               if (err) {
//                 throw err;
//               }
//               console.log(results.rows);
              
//               req.flash("success_msg","you are now registered.Please log in");
//               res.redirect("/users/log_in");
//             }
//           );
//         }
//       }
//     );
//   }

// });
// app.post("/users/log_in", (req, res) => {
//   const { email, password } = req.body;

//   pool.query(`SELECT * FROM patients WHERE email = $1`, [email], (err, results) => {
//     if (err) {
//       throw err;
//     }
//     if (results.rows.length > 0) {
//       const user = results.rows[0];
//       bcrypt.compare(password, user.password, (err, isMatch) => {
//         if (err) {
//           throw err;
//         }
//         if (isMatch) {
//           const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
//           res.cookie('token', accessToken, { httpOnly: true });
//           res.redirect("/users/patient");
//         } else {
//           req.flash("error_msg", "Password is incorrect");
//           res.redirect("/users/log_in");
//         }
//       });
//     } else {
//       req.flash("error_msg", "Email is not registered");
//       res.redirect("/users/log_in");
//     }
//   });
// });
// app.get("/users/logout", (req, res) => {
//   res.clearCookie('token');
//   req.flash("success_msg", "You have logged out");
//   res.redirect("/users/log_in");
// });

// function authenticateToken(req, res, next) {
//   const token = req.cookies.token;
//   if (token == null) return res.redirect("/users/log_in");

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.redirect("/users/log_in");
//     req.user = user;
//     next();
//   });
// }

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });