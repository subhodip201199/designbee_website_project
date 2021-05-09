require('dotenv').config()

const express = require('express')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const bodyParser = require('body-parser')

const pool = require('./config/database.js')

const app = express()

var url = require('url');
var cors = require('cors');
const { Console } = require("console");
const { SSL_OP_TLS_D5_BUG } = require("constants");

//-----------for file upload---------------

var formidable = require("formidable");
var fs = require("fs");



app.use(express.static(__dirname + '/uploads'));

//--------------------------

const PORT = process.env.PORT || 80

//const routes = require('./routes/index')

app.use(express.static(__dirname + '/views'));


app.use(cors());

app.set('view engine', 'ejs')
app.use(session({
    secret: 'thatsecretthinggoeshere',
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next){
    res.locals.message = req.flash('message');
    next();
});

//app.use('/', routes)
require('./config/passport')(passport)

app.listen(PORT, () => {
    console.log(`Application server started on port: ${PORT}`)
})


  
//------------------------ROUTINGS---------------------------//

app.get("/", (req, res) =>  {
  res.render("index");
});


var project_id;

app.get("/project", (req, res) =>  {
  var data = url.parse(req.url, true);
  data = data.query;
  project_id = data.project_id;

  console.log(project_id);

  res.render("project.ejs");
});

app.get("/blog_user", (req, res) =>  {
  res.render("blog.ejs");
});





//--------------------------APIs--------------------------------//

app.get("/project/getdata", async (req, res) => {

  pool.query(
   "select project_id, project_category, project_title from project order by sl_no desc LIMIT 15",
  
     
  //    WHERE id = 1`,
  //  
    (err, results) => {
      if (err) {
        throw err;
      }
      let data = results.rows;

      console.log(data);
      
      res.send(data);
    }
  );
});



app.get("/project/details/getdata", async (req, res) => {

  //var data = url.parse(req.url, true);
  //data = data.query;
  //project_id = data.project_id;

  pool.query(
   "select project_id, project_title, project_details from project where project_id = " + "'" +  project_id + "'",
  
     
  //    WHERE id = 1`,
  //  
    (err, results) => {
      if (err) {
        throw err;
      }
      let data = results.rows;

      console.log(data);
      
      res.send(data);
    }
  );
});


app.get("/home-text/getdata", async (req, res) => {

  pool.query(
   "select * from home_title order by id desc LIMIT 1",
  
     
  //    WHERE id = 1`,
  //  
    (err, results) => {
      if (err) {
        throw err;
      }
      let data = results.rows;

      console.log(data);
      
      res.send(data);
    }
  );
});

app.get("/homepage_video/getdata", async (req, res) => {

  pool.query(
   "select * from homepage_video order by id desc LIMIT 1",
  
     
  //    WHERE id = 1`,
  //  
    (err, results) => {
      if (err) {
        throw err;
      }
      let data = results.rows;

      console.log(data);
      
      res.send(data);
    }
  );
});


app.get("/blog/getdata", async (req, res) => {

  pool.query(
   "select * from blog order by id desc LIMIT 10",
  
     
  //    WHERE id = 1`,
  //  
    (err, results) => {
      if (err) {
        throw err;
      }
      let data = results.rows;

      console.log(data);
      
      res.send(data);
    }
  );
});


app.get("/aboutus/getdata", async (req, res) => {

  pool.query(
   "select * from aboutus order by id desc LIMIT 1",
  
     
  //    WHERE id = 1`,
  //  
    (err, results) => {
      if (err) {
        throw err;
      }
      let data = results.rows;

      console.log(data);
      
      res.send(data);
    }
  );
});

app.post("/add/contact", async (req, res) => {

  let { name, email, message } = req.body;

  console.log(name, email, message);

let errors = [];

if (!name || !email || !message) {
  errors.push({ message: "Please enter all fields" });
}

console.log(errors);
if (errors.length > 0) {
  res.redirect("/");
} else{
  // Validation passed
  
        pool.query(
          `INSERT INTO contact (name, email, message)
              VALUES ($1, $2, $3)`,
          [name, email, message],
          (err, results) => {
            if (err) {
              throw err;
            }
            res.redirect("/");
          }
        );
    }
    
});


app.get("/contact-details/getdata", async (req, res) => {

  pool.query(
   "select * from contact_details order by id desc LIMIT 1",
  
     
  //    WHERE id = 1`,
  //  
    (err, results) => {
      if (err) {
        throw err;
      }
      let data = results.rows;

      console.log(data);
      
      res.send(data);
    }
  );
});


/* Subhodip Please see this========================================*/

app.get("/work/getdata", async (req, res) => {

  pool.query(
   "select * from work order by id desc LIMIT 4",
  
     
  //    WHERE id = 1`,
  //  
    (err, results) => {
      if (err) {
        throw err;
      }
      let data = results.rows;

      console.log(data);
      
      res.send(data);
    }
  );
});


app.get("/review/getdata", async (req, res) => {

  pool.query(
   "select * from review order by id desc LIMIT 4",
  
     
  //    WHERE id = 1`,
  //  
    (err, results) => {
      if (err) {
        throw err;
      }
      let data = results.rows;

      console.log(data);
      
      res.send(data);
    }
  );
});




//------------------------ROUTINGS for admin panel---------------------------//

app.get("/admin_panel", (req, res) =>  {
  res.redirect("/login");
});


app.get('/register', (req, res) => {
     if (req.isAuthenticated()) {
          res.redirect('/register')
      } else {
          res.render('register', {
              title: 'Register',
              user: req.user,
              message: res.locals.message
          })
      }
  })
  
  app.post('/register', (req, res, next) => {
    
        //req.flash('message', 'You are already logged in.')
        //res.redirect('/profile')
        let user = (req.body.username).toLowerCase()
        let pass = req.body.password
        let passConf = req.body.passConf
        let name = req.body.name
        let phone = req.body.phone
        let email = req.body.email
        if (user.length === 0 || pass.length === 0 || passConf.length === 0) {
            req.flash('message', 'You must provide a username, password, and password confirmation.')
            res.redirect('/register')
        } else if (pass != passConf) {
            req.flash('message', 'Your password and password confirmation must match.')
            res.redirect('/register')
        } else {
            next()
        }
     
  }, passport.authenticate('register', {
    successRedirect : '/home',
    failureRedirect : '/register',
    failureFlash : true
  }))

  app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        req.flash('message', 'Your are already logged in.')
        res.redirect('/home')
    } else {
        res.render('login', {
            title: 'Login',
            user: req.user,
            message: res.locals.message
        })
    }
})

app.post('/login', (req, res, next) => {
  if (req.isAuthenticated()) {
      req.flash('message', 'You are already logged in.')
      res.redirect('/home')
  } else {
      let user = (req.body.username).toLowerCase()
      let pass = req.body.password
      if (user.length === 0 || pass.length === 0) {
          req.flash('message', 'You must provide a username and password.')
          res.redirect('/login')
      } else {
          next()
      }
  }
}, passport.authenticate('login', {
  successRedirect : '/home',
  failureRedirect : '/login',
  failureFlash : true
}))


app.get('/logout', (req, res) => {
  if (req.isAuthenticated()) {
      console.log('User [' + req.user.username + '] has logged out.')
      req.logout()
      res.redirect('/login');
  } else {
      res.redirect('/login')
  }
})

app.get("/home", (req, res) =>  {
  res.render("home_admin");
});

app.get("/portfolio", (req, res) =>  {
  res.render("portfolio_admin");
});

app.get("/aboutus", (req, res) =>  {
  res.render("aboutus_admin");
});

app.get("/home_page_section", (req, res) =>  {
  res.render("home_page_section_admin");
});

app.get("/contact", (req, res) =>  {
  res.render("contact_admin");
});

app.get("/review", (req, res) =>  {
  res.render("review_admin");
});

app.get("/blog", (req, res) =>  {
  res.render("blog_admin");
});

app.get("/work", (req, res) =>  {
  res.render("work_admin");
});



//-------------------------API------------------//



app.post("/project/add", async (req, res) => {

  //let { project_id, project_category, title, details } = req.body;

  //--------------------------------------


  //var project_id;
  //var project_category;
  //var title;
  //var details;

  var formData = new formidable.IncomingForm();
  formData.parse(req, function (error, fields, files) {
     
    var project_id = fields.project_id;
    var project_category = fields.project_category;
    var title = fields.title;
    var details = fields.details;



      var extension = '.jpg';
      var newPath1 = "uploads/" + project_id + "_picture" + extension;
      fs.rename(files.projectphoto.path, newPath1, function (errorRename) {
           console.log("file renamed")
       });

       console.log(project_id, project_category, title, details);

let errors = [];

if (!project_id || !project_category || !title || !details) {
  errors.push({ message: "Please enter all fields" });
}

console.log(errors);
if (errors.length > 0) {
  res.redirect("/portfolio");
} else{
  // Validation passed
  
        pool.query(
          `INSERT INTO project (project_id, project_category, project_title, project_details)
              VALUES ($1, $2, $3, $4)`,
          [project_id, project_category, title, details],
          (err, results) => {
            if (err) {
              throw err;
            }
            res.redirect("/portfolio");
          }
        );
    }
      })


  //----------------------------------------
});




app.post("/homepage_title/add", async (req, res) => {

  let { title1, title2_1, title2_2, title3_1, title3_2, title4_1, title4_2 } = req.body;

  console.log(title1, title2_1, title2_2, title3_1, title3_2, title4_1, title4_2);

let errors = [];

if (!title1 || !title2_1 || !title2_2 || !title3_1 || !title3_2 || !title4_1 || !title4_2) {
  errors.push({ message: "Please enter all fields" });
}

console.log(errors);
if (errors.length > 0) {
  res.redirect("/home_page_section");
} else{
  // Validation passed
  
        pool.query(
          `INSERT INTO home_title (title1, title2_1, title2_2, title3_1, title3_2, title4_1, title4_2)
              VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [title1, title2_1, title2_2, title3_1, title3_2, title4_1, title4_2],
          (err, results) => {
            if (err) {
              throw err;
            }
            res.redirect("/home_page_section");
          }
        );
    }
    
});


app.post("/homepage_video/add", async (req, res) => {

  let { link } = req.body;

  console.log(link);

let errors = [];

if (!link) {
  errors.push({ message: "Please enter all fields" });
}

console.log(errors);
if (errors.length > 0) {
  res.redirect("/portfolio");
} else{
  // Validation passed
  
        pool.query(
          `INSERT INTO homepage_video (video_link)
              VALUES ($1)`,
          [link],
          (err, results) => {
            if (err) {
              throw err;
            }
            res.redirect("/home_page_section");
          }
        );
    }
    
});


app.get("/project/getdata", async (req, res) => {

  pool.query(
   "select project_id, project_category, project_title  from project order by sl_no desc LIMIT 15",
  
     
  //    WHERE id = 1`,
  //  
    (err, results) => {
      if (err) {
        throw err;
      }
      let data = results.rows;

      console.log(data);
      
      res.send(data);
    }
  );
});

//app.get("/project/content/getdata", async (req, res) => {
//
//  var data = url.parse(req.url, true);
//  data = data.query;
//  project_id = data.project_id;
//
//  console.log(project_id)
//
//  pool.query(
//   "select project_content from project where project_id = " + "'" + project_id + "'",
//  
//     
//  //    WHERE id = 1`,
//  //  
//    (err, results) => {
//      if (err) {
//        throw err;
//      }
//      let data = results.rows;
//
//      console.log(data);
//      
//      res.send(data);
//    }
//  );
//});

app.post("/project/project_details/update", async (req, res) => {

  let { project_id, project_details } = req.body;

  console.log(project_id, project_details);

let errors = [];

if (!project_details) {
  errors.push({ message: "Please enter all fields" });
}

console.log(errors);
if (errors.length > 0) {
  res.redirect("/portfolio");
} else{
  // Validation passed
  
        pool.query(
          `UPDATE project SET project_details = $1
           WHERE project_id = $2`,
          [project_details, project_id],
          (err, results) => {
            if (err) {
              throw err;
            }
            res.redirect("/portfolio");
          }
        );
    }
    
});



//--------------------blog--------------------//

app.post("/blog/video/add", async (req, res) => {

  let { video_link, video_content } = req.body;

  console.log(video_link);

let errors = [];

if (!video_link) {
  errors.push({ message: "Please enter all fields" });
}

console.log(errors);
if (errors.length > 0) {
  res.redirect("/blog");
} else{
  // Validation passed


  var content_type = 'video';
  
        pool.query(
          `insert into blog (content_type, video_link, blog_content)
          values($1, $2, $3)`,
          [content_type, video_link, video_content],
          (err, results) => {
            if (err) {
              throw err;
            }
            res.redirect("/blog");
          }
        );
    }
    
});


app.post("/blog/image/add", async (req, res) => {

  var formData = new formidable.IncomingForm();
  formData.parse(req, function (error, fields, files) {
     
    var image_content = fields.title1;
    

       console.log(image_content);

let errors = [];

if (!image_content) {
  errors.push({ message: "Please enter all fields" });
}

console.log(errors);
if (errors.length > 0) {
  res.redirect("/blog");
} else{
  // Validation passed

  var content_type = 'image';
  
        pool.query(
          `insert into blog (content_type, blog_content)
              values($1, $2)
              returning id`,
          [content_type, image_content],
          (err, results) => {
            if (err) {
              throw err;
            }

            let data = results.rows;
            var blog_id = data[0].id;

            var extension = '.jpg';
            var newPath1 = "uploads/" + blog_id + "_blog_picture" + extension;
            fs.rename(files.blogphoto.path, newPath1, function (errorRename) {
                 console.log("file renamed")
             });
             
            res.redirect("/blog");
          }
        );
    }
      })
    
});



//----------------------about us--------------------//

app.post("/aboutus/add", async (req, res) => {

  let { aboutus } = req.body;

  console.log(aboutus);

let errors = [];

if (!aboutus) {
  errors.push({ message: "Please enter all fields" });
}

console.log(errors);
if (errors.length > 0) {
  res.redirect("/aboutus");
} else{
  // Validation passed


  var content_type = 'video';
  
        pool.query(
          `insert into aboutus (aboutus)
          values($1)`,
          [aboutus],
          (err, results) => {
            if (err) {
              throw err;
            }
            res.redirect("/aboutus");
          }
        );
    }
    
});


app.post("/aboutus/image/add", async (req, res) => {

  var formData = new formidable.IncomingForm();
  formData.parse(req, function (error, fields, files) {
     
      var extension = '.jpg';
      var newPath1 = "uploads/aboutus_picture" + extension;
      fs.rename(files.aboutusphoto.path, newPath1, function (errorRename) {
           console.log("file renamed")
      });

      res.redirect("/aboutus")
  })
})


app.get("/blog/getdata", async (req, res) => {

  pool.query(
   "select * from blog order by id desc LIMIT 10",
  
     
  //    WHERE id = 1`,
  //  
    (err, results) => {
      if (err) {
        throw err;
      }
      let data = results.rows;

      console.log(data);
      
      res.send(data);
    }
  );
});


app.get("/blog/remove", async (req, res) => {

  var data = url.parse(req.url, true);
  data = data.query;
  var blog_id = data.blog_id;

  console.log("delete from blog where id = "  + blog_id)

  pool.query(
   "delete from blog where id = "  + blog_id + " returning id, content_type",
  
     
  //    WHERE id = 1`,
  //  
    (err, results) => {
      if (err) {
        throw err;
      }

      //var data = results.rows;

      //var content_type = data[0].content_type;

      //if(content_type == 'image') {
      //  const pathToFile =  data[0].id + "_blog_picture.jpg"
//
      //  fs.unlink(pathToFile, function(err) {
      //    if (err) {
      //      throw err
      //    } else {
      //      console.log("Successfully deleted the file.")
      //    }
      //  })
      //}

        
      
      res.send();
    }
  );
});

app.get("/project/remove", async (req, res) => {

  var data = url.parse(req.url, true);
  data = data.query;
  var project_id = data.project_id;

  

  pool.query(
   "delete from project where project_id = "  + "'" + project_id + "'",
  
     
  //    WHERE id = 1`,
  //  
    (err, results) => {
      if (err) {
        throw err;
      }

    

        
      
      res.send();
    }
  );
});

app.post("/work/add", async (req, res) => {

  let { title, work_details } = req.body;

  console.log(title, work_details);

let errors = [];

if (!title || !work_details) {
  errors.push({ message: "Please enter all fields" });
}

console.log(errors);
if (errors.length > 0) {
  res.redirect("/work");
} else{
  // Validation passed
  
        pool.query(
          `INSERT INTO work (title, work_details)
              VALUES ($1, $2)`,
          [title, work_details],
          (err, results) => {
            if (err) {
              throw err;
            }
            res.redirect("/work");
          }
        );
    }
    
});

app.get("/work/getdata", async (req, res) => {

  pool.query(
   "select * from work order by id desc LIMIT 4",
  
     
  //    WHERE id = 1`,
  //  
    (err, results) => {
      if (err) {
        throw err;
      }
      let data = results.rows;

      console.log(data);
      
      res.send(data);
    }
  );
});


app.get("/contact/getdata", async (req, res) => {

  pool.query(
   "select * from contact order by id desc LIMIT 30",
  
     
  //    WHERE id = 1`,
  //  
    (err, results) => {
      if (err) {
        throw err;
      }
      let data = results.rows;

      console.log(data);
      
      res.send(data);
    }
  );
});

app.post("/contact-details/add", async (req, res) => {

  let { address, contact1, contact2, email } = req.body;

  console.log(address, contact1, contact2, email);

let errors = [];

if (!address || !contact1 || !contact2 || !email) {
  errors.push({ message: "Please enter all fields" });
}

console.log(errors);
if (errors.length > 0) {
  res.redirect("/work");
} else{
  // Validation passed
  
        pool.query(
          `INSERT INTO contact_details (address, contact1, contact2, email)
              VALUES ($1, $2, $3, $4)`,
          [address, contact1, contact2, email],
          (err, results) => {
            if (err) {
              throw err;
            }
            res.redirect("/contact");
          }
        );
    }
    
});

app.get("/contact-details/getdata", async (req, res) => {

  pool.query(
   "select * from contact_details order by id desc LIMIT 1",
  
     
  //    WHERE id = 1`,
  //  
    (err, results) => {
      if (err) {
        throw err;
      }
      let data = results.rows;

      console.log(data);
      
      res.send(data);
    }
  );
});

app.post("/review/add", async (req, res) => {

  let { name, review } = req.body;

  console.log(name, review);

let errors = [];

if (!name || !review) {
  errors.push({ message: "Please enter all fields" });
}

console.log(errors);
if (errors.length > 0) {
  res.redirect("/review");
} else{
  // Validation passed
  
        pool.query(
          `INSERT INTO review (name, review)
              VALUES ($1, $2)`,
          [name, review],
          (err, results) => {
            if (err) {
              throw err;
            }
            res.redirect("/review");
          }
        );
    }
    
});

app.get("/review/getdata", async (req, res) => {

  pool.query(
   "select * from review order by id desc LIMIT 4",
  
     
  //    WHERE id = 1`,
  //  
    (err, results) => {
      if (err) {
        throw err;
      }
      let data = results.rows;

      console.log(data);
      
      res.send(data);
    }
  );
});