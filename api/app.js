const express = require('express');
const app = express();

const { mongoose } = require('./db/mongoose');

const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');

// Load in the mongoose models
const {  User, Booking, Destinations } = require('./db/models');

// Load middleware
app.use(bodyParser.json());
//app.use(express.json());

// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});

let isAdmin = false;
const adminId = '6889f8bc873ad16eb6066535';
//PREDHODNI ADMIN! : 63009a6829697e4d0f057e75


app.get('/', (req, res) => {
    res.send('Welcome')
})



// check whether the request has a valid JWT access token
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');
    
    // verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
            if (err) {
                // there was an error
                // jwt is invalid - * DO NOT AUTHENTICATE *
                res.status(401).send(err);
            } else {
                // jwt is valid
                
                
                if(decoded._id === adminId){
                    isAdmin = true;
                    req.user_id = adminId;
                }else{
                    isAdmin = false; 
                    req.user_id = decoded._id;
                                      
                }

                next();
                
            }
    });
}

// Verify Refresh Token Middleware (which will be verifying the session)
let verifySession = (req, res, next) => {
    // grab the refresh token from the request header
    let refreshToken = req.header('x-refresh-token');

    // grab the _id from the request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user couldn't be found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }


        // if the code reaches here - the user was found
        // therefore the refresh token exists in the database - but we still have to check if it has expired or not

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                    if(user._id == adminId){
                        isSessionValid = true;
                    }
                }
                
            }
        });

        if (isSessionValid) {
            // the session is VALID - call next() to continue with processing this web request
            
            next();
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}

/*------------------ Destinations ---------------*/



app.get('/destinations', /*authenticate,*/ (req, res) => {
    // We want to return an array of all the bookings that belong to the authenticated user 
    if(isAdmin == true){
        Destinations.find({
        }).then((destinations) => {
            res.send(destinations);
    
        }).catch((e) => {
            res.send(e);
        });
    }else {
        Destinations.find({
            _userId: req.user_id
        }).then((destinations) => {
            res.send(destinations);
    
        }).catch((e) => {
            res.send(e);
        });
    }
})



app.get(`/destinations/:id`, (req, res) => {
    
    Destinations.findById(req.params.id)
        .then(doc => {
            if(!doc){
                return res.status(404).end();
            }
            return res.status(200).json(doc)
        }).catch((e) => {
            res.send(e);
        })
})

app.post('/destinations', /*authenticate,*/ (req, res) => {
    // We want to create a new bookings and return the new bookings document back to the user (which includes the id)
    // The bookings information (fields) will be passed in via the JSON request body
    let destinations = req.body.destination;
    let type = req.body.type;
    let description = req.body.description;
    let price = req.body.price;
    //let title = req.body.title;

    let newDestination = new Destinations({
        //title
        destinations,
        type,
        description,
        price,
        //_userId: req.user_id
    });
    newDestination.save().then((destinationDoc) => {
        // the full list document is returned (incl. id)
        res.send(destinationDoc);
    })
});

app.delete('/destinations/:id', (req, res) => {
    Destinations.findOneAndRemove({
        _id: req.params.id
    }).then((removedDestinationDoc) => {
        res.send(removedDestinationDoc)
        
    })
})

/*-----------------------------------------------*/
/*----------- Booking ---------------------------*/

app.get('/booking', authenticate, (req, res) => {
    // We want to return an array of all the bookings that belong to the authenticated user 
    if(isAdmin == true){
        Booking.find({
        }).then((bookings) => {
            res.send(bookings);
        }).catch((e) => {
            res.send(e);
        });
    } else {
        Booking.find({
            _userId: req.user_id
        }).then((bookings) => {
            res.send(bookings);
        }).catch((e) => {
            res.send(e);
        });
    }
})


app.get(`/booking/:id`, (req, res) => {
    
    Booking.findById(req.params.id)
        .then(doc => {
            if(!doc){
                return res.status(404).end();
            }
            return res.status(200).json(doc)
        }).catch((e) => {
            res.send(e);
        })
})

app.post('/destinations/book-now', authenticate, (req, res) => {
    // We want to create a new bookings and return the new bookings document back to the user (which includes the id)
    // The bookings information (fields) will be passed in via the JSON request body
    let destination = req.body.destination;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let numberOfGuests = req.body.numberOfGuests;
    let name = req.body.name;
    let lastName = req.body.lastName;
    let phoneNumber = req.body.phoneNumber;
    let email = req.body.email;
    //let title = req.body.title;

    let newBooking = new Booking({
        //title
        destination,
        startDate,
        endDate,
        numberOfGuests,
        name,
        lastName,
        phoneNumber,
        email,
        _userId: req.user_id
    });
    newBooking.save().then((bookingDoc) => {
        // the full bookings document is returned (incl. id)
        res.send(bookingDoc);
    })
});

app.delete('/booking/:id', (req, res) => {
    Booking.findOneAndRemove({
        _id: req.params.id
    }).then((removedBookingDoc) => {
        res.send(removedBookingDoc)
        
    })
})

/*-----------------------------------------------*/
/*----------------- User ------------------------*/
/**
 * POST /users
 * Purpose: Sign up
 */
 app.post('/user/register', (req, res) => {
    // User sign up

    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned.
        // now we geneate an access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

/**
 * POST /users/login
 * Purpose: Login
 */

 app.post('/user/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    console.log('Request body:', req.body);
    User.findByCredentials(email, password).then((user) => {
        console.log('User found:', user);
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        console.error('Login error:', e);
        res.status(400).send({
            error: 'Login failed',
            detail: e instanceof Error ? e.message : typeof e === 'string' ? e : 'Unexpected error'
        });
    });
})

/*app.post('/user/login', (req, res) => {
  console.log('BODY:', req.body); // mora da se vidi { email: ..., password: ... }
  res.send('OK');
});*/
/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */
 app.get('/user/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})

app.get('/user', /*authenticate,*/ (req, res) => {
    // We want to return an array of all the users that belong to the authenticated user 
    User.find({
        //_userId: req.user_id
    }).then((users) => {
        res.send(users);
    }).catch((e) => {
        res.send(e);
    });
})
app.get('/user/:id', (req, res)=> {

    User.findById(req.params.id)
        .then(doc => {
            if(!doc){
                return res.status(404).end();
            }
            return res.status(200).json(doc)
        }).catch((e) => {
            res.send(e);
        })
    
    /*
    User.findOne({
        email: req.body.email
    }).then((user) => {
        res.send(user).catch((e) => {
            res.send(e);
        })
    })*/
}) 

app.delete('/user/:id', (req, res) => {
    User.findOneAndRemove({
        _id: req.params.id
    }).then((removedUserDoc) => {
        res.send(removedUserDoc)
        
    })
})
/*-----------------------------------------------*/

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})