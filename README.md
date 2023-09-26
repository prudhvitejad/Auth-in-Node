 
# Auth in Node

- [Middleware](#Middleware)
- [built-in middleware](#built-in-middleware)
- [Cookies vs Local Storage vs Session Storage](#Cookies-vs-Local-Storage-vs-Session-Storage)
- [HTTP Headers and Cookies](#HTTP-Headers-and-Cookies)
- [Node and Express - Cookies](#Node-and-Express-Cookies)
- [Complete guide to understanding the express-session library](#Complete-guide-to-understanding-the-express-session-library)
- [Examples](#Examples)
- [Authentication Vs Authorization](#Authentication-Vs-Authorization)
- [JSON Web Tokens](#JSON-Web-Tokens)
- [Password Hashing](#How-password-hashing-works-under-the-hood)
- [Generating the secret key for the Access-token and the Refresh-token](#Generating-the-secret-key-for-the-Access-token-and-the-Refresh-token)
- [Logging-In-Users](#Logging-In-Users)
- [Verifying an Access Token](#Verifying-an-Access-Token)
- [Generating Refresh Tokens](#Generating-Refresh-Tokens)
- [Using Refresh Tokens to generate New tokens](#Using-Refresh-Tokens-to-generate-New-tokens)
- [Introduction about Redis](#Introduction-about-Redis)
- [Blacklisting Refresh Tokens using Redis](#Blacklisting-Refresh-Tokens-using-Redis)
- [Logging Out Users](#Logging-Out-Users)
- [Checking the Current User](#Checking-the-Current-User)
- [Conditional Rendering](#Conditional-Rendering)
- [MVC(Model View Controller) Pattern](#MVC(Model-View-Controller)-Pattern)

### Middleware
-> Middleware is a function or program or something that is going to run b/w the time that the server gets the request and the time that the server sends the request out to the client <br/>
-> next is a function and all we need to do with the next function is we should/can call it <br/>
-> next() means go to next request handler <br/>
-> if we define a function and declared it as a middleware using app.use(<functionName>) in the top of all routes then it becomes the Global Middleware and  it will be called before any of the route is called and then the actual route will be called <br/>
-> if we define a function and declared it as a middleware using app.use(<functionName>) in the bottom of all routes then first the actual route is called and if that route is calling next() then that middleware will be called <br/>
-> we can use middleware functions in routes-level also, if we define a function and if we call that middleware function in the route then that middleware would be called first and then the actual route

Eg:(i)
```
const express = require("express");						const express = require("express");

const app = express();								const app = express();

app.get("/", (req,res,next) => {						function func1(req,res,next) {
										    console.log("Inside standard express route");
										}
    console.log("Inside standard express route");		(OR)		
});										app.get("/", func1);

app.listen(3000);								app.listen(3000);

Output:										Output:
------										------
Inside standard express route							Inside standard express route
```

Eg:(ii)
```
app.get('/users', auth, (req,res) => {
     ......
})

function auth(req,res,next) {
    if(req.query.admin === 'true') {
        req.admin = true
        next()
    }
    else
        res.send('No Permission to view for the user')
}
```
Note:
-----
-> If we are using more than 1 middleware at global-level then we should use next() in every middleware function otherwise they will get confusion thinking which is the next operation we should do and our app crashes by loading and loading the page


Eg:(iii)
```
const express = require("express");

const app = express();

app.use(middlewareFunc2);
app.use(middlewareFunc1);

function func1(req,res,next) {
    console.log("Inside standard express route");
}

function middlewareFunc1(req,res,next) {
    console.log("Inside standard express middleware function1");
    next();
}

function middlewareFunc2(req,res,next) {
    console.log("Inside standard express middleware function2");
    next();
}

function middlewareFunc3(req,res,next) {
    console.log("Inside standard express middleware function3");
    next();
}

function middlewareFunc4(req,res,next) {
    console.log("Inside standard express middleware function4");
    next();
}

function middlewareFunc5(req,res,next) {
    console.log("Inside standard express middleware function5");
    next();
}

app.get("/", middlewareFunc3, func1);

app.use(middlewareFunc5);
app.use(middlewareFunc4);

app.listen(3000);

Output:
---------
Inside standard express middleware function2
Inside standard express middleware function1
Inside standard express middleware function3
Inside standard express route
```

Eg:(iv)
```
const express = require("express");

const app = express();

app.use(middlewareFunc2);
app.use(middlewareFunc1);

function func1(req,res,next) {
    console.log("Inside standard express route");
    next();
}

function middlewareFunc1(req,res,next) {
    console.log("Inside standard express middleware function1");
    next();
}

function middlewareFunc2(req,res,next) {
    console.log("Inside standard express middleware function2");
    next();
}

function middlewareFunc3(req,res,next) {
    console.log("Inside standard express middleware function3");
    next();
}

function middlewareFunc4(req,res,next) {
    console.log("Inside standard express middleware function4");
    next();
}

function middlewareFunc5(req,res,next) {
    console.log("Inside standard express middleware function5");
    next();
}

app.get("/", middlewareFunc3, func1);

app.use(middlewareFunc5);
app.use(middlewareFunc4);

app.listen(3000);

Output:
---------
Inside standard express middleware function2
Inside standard express middleware function1
Inside standard express middleware function3
Inside standard express route
Inside standard express middleware function5
Inside standard express middleware function4
```

## built-in-middleware

#### app.use(express.static("public")) :

-> express.static() is a static middleware <br/>
-> To serve static files such as images, CSS files, JavaScript files etc., to the browser, we use the express.static() built-in middleware function in Express.
```
Eg: app.use(express.static('public'))
```
-> Now, we can load the files that are in the public directory:

	http://localhost:3000/images/kitten.jpg
	http://localhost:3000/css/style.css
	http://localhost:3000/js/app.js
	http://localhost:3000/images/bg.png
	http://localhost:3000/hello.html

-> To use multiple static assets directories, call the express.static middleware function multiple times:

	app.use(express.static('public'))
	app.use(express.static('files'))

-> To create a virtual path prefix (where the path does not actually exist in the file system) for files that are served by the express.static function, specify a mount path for the static directory, as shown below:

	app.use('/static', express.static('public'))

-> Now, we can load the files that are in the public directory from the /static path prefix.

	http://localhost:3000/static/images/kitten.jpg
	http://localhost:3000/static/css/style.css
	http://localhost:3000/static/js/app.js
	http://localhost:3000/static/images/bg.png
	http://localhost:3000/static/hello.html



#### app.use(express.json()) :

-> express.json() is a method in built-in express to recognize the incoming Request Object as a JSON Object. <br/>
-> This method is called as a middleware in our application using the code: 
```
	app.use(express.json());
```
-> express.json() is a parser middleware and we don't need to import anything else, it comes along with express <br/>
-> What does this do is, well basically it takes any json data that comes along with a request and it passes it into a javascript object for us so that we can then use it inside the code and it attaches that object with that data for us to the request object so that we can access it in our request handlers <br/>
-> express.json() expects request data to be sent in JSON format, which often resembles a simple JS object:

	Eg: {"Name": "Pikachu", "Type": "Banana", "Number In Stable": 12}



#### app.use(express.urlencoded()) :

-> express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays. <br/>
-> This method is called as a middleware in our application using the code: 
```
	app.use(express.urlencoded());
```
	// parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
	app.use(express.urlencoded({ extended: false }));

	// parse incoming Request Object if object, with nested objects, or generally any type.
	app.use(express.urlencoded({ extended: true }));

-> extended option allows choosing between parsing the URL-encoded data with the query string library (when false) or the qs library (when true). <br/>
-> express.urlencoded middleware is used only for parsing request body of content-type x-www-form-urlencoded
Eg: Assuming we have an app running on port 8080, and we have a request like:
```
	curl -d"foo=bar" -H"Content-Type: application/x-www-form-urlencoded" http://localhost:8080
```
-> We will only be able to access req.body.foo if we have the express.urlencoded middleware. <br/>
-> express.urlencoded() expects request data to be sent encoded in the URL, usually in strings or arrays:
	
	Eg: .../Name=Pikachu&Type=Banana&Number+In+Stable=12


### Cookies vs Local Storage vs Session Storage:
-> There are 3 main ways to store data inside of a browser which are 
```
	(i)local storage 
	(ii)session storage and
	(iii)cookies 
```
-> All 3 of them are being stored on the user's actual browser that they're using <br/>
-> If they're using Google Chrome, it'll be stored in their Google Chrome, if they're using Firefox, it'll be stored in their Firefox and so on <br/>
-> So that means that any cookies or local storage or any of that's saved on a user's browser for eg. Chrome will not be available on another browser on their same computer for eg. Firefox <br/>
-> So it's browser independent, also users do not share cookies and local storage between them <br/>
-> So if we set the local storage for a certain user, none of the other users of that site will be able to see that because it's stored on that user's computer only and nowhere else, so this is really meant for storing information related to a single user and it's not important if this information gets lost <br/>
Eg: Since the user can always delete any of their cookies, local storage or session storage at any time


-> Local storage and session storage are very similar in how they interact and they're only different in a few instances while cookies are almost completely different than the other two and are also quite a bit older than the other two 
```
---------------------------------------------------------------------------------------------------------
|				|	Cookies		|	Local Storage	|	Session Storage	|
---------------------------------------------------------------------------------------------------------
|	Capacity		|	4kb		|	10mb		|	5mb		|
---------------------------------------------------------------------------------------------------------
|	Browsers		|	HTML4/HTML5	|	HTML5		|	HTML5		|
---------------------------------------------------------------------------------------------------------
|	Accessible from		|	Any window	|	Any window	|	Same tab	|
---------------------------------------------------------------------------------------------------------
|	Expires			|	Manually Set	|	Never		|	On tab close	|
---------------------------------------------------------------------------------------------------------
|	Storage Location 	|	Browser & server|	Browser only	|	Browser only	|
---------------------------------------------------------------------------------------------------------
|	Sent with requests	|	Yes		|	No		|	No		|
---------------------------------------------------------------------------------------------------------	
```		


-> cookies can store only a much smaller amount of information, the capacity is 4 kilobytes for most browsers while local storage and session storage can hold 10 megabits and 5 megabits respectively this means that cookies are going to be much smaller than local storage and session storage but that's okay for their use cases <br/>
-> Also cookies are supported in older browsers which support HTML4 because they're been around for much longer but that's not really something you have to worry about because HTML5 is in pretty much any browser being used now <br/>
-> cookies and local storage are available for any window inside the browser, so if we have Google Chrome open on one tab or another tab the cookies are going to be available on all the different tabs that we have open to that website while session storage is only available in the single tab that we have open and it won't be available if we open another tab <br/>


-> Session storage is for the one browsing session which is why it's called Session storage and it is removed as soon as the user closes the tab where that session was set <br/>
-> While Local storage is around forever until the user ends up deleting it or delete it ourself inside of the code <br/>
-> For cookies, we actually have to set when they expire. Usually we'll either set an infinite expiration for example a year, very very far in the future or if we want it to expire in a certain timeframe to see if the user has done something in that timeframe but we have complete control over when the cookie actually expires <br/>

-> As for storage location, local storage and session storage are both on the browser but cookies while they are stored in the browser they are sent to the server every time a user requests something from the server, whether it's an image,HTML file, CSS file or anything <br/>
-> The cookies get sent along with the request which is why they have a much smaller capacity because all the information in the cookies gets sent to the server <br/>
-> If we have a lot of cookies that are really large, it'll slow down our request to the server and the requests coming back from the server, this is why we want to make sure the cookies that we use are small and as limited as possible so that we don't slow down the request any more than we need <br/>
-> It also makes cookies really good for doing certain authentication related tasks because they actually get sent to the browser or to the server from the browser unlike local storage or session storage <br/>
 
-> For the most part, if we're going to be storing something in the user's browser, we almost always want to use Local storage or Session storage depending on how long we want it to live whether we want it to be for one session or if we want it to live after they close the browser and we only really want to use cookies if we need the aspect of sending it to the server because if we don't need to send it to a server then we just adding extra header and cookies are much harder to deal with so we should always use local storage or session storage unless we need to send it to the server <br/>


-> If we wanted to start messing around with the actual different storage mechanisms of local storage, session storage and cookies, we need to figure out where we can view that information 
```
	google chrome -> dev tools -> application
```
This is the scetion where all that information is going to be stored

-> At the beginning, all 3 of these will be pretty much empty <br/>
-> To get started,let's start with creating some variables and adding them to our local storage <br/>
-> In order to do that we need to access the 'localStorage' variable in JavaScript <br/>
	
Eg: 
``` 
localStorage.setItem('name','Prudhvi');	//for setting/inserting values
localStorage.setItem('name','Teja');	//for updating values
localStorage.getItem('name');		//for getting values
localStorage.removeItem('name');	//for removing values
```
-> session storage works exactly the same as local storage and all the methods are exactly the same and we just need to use the 'sessionStorage' object instead of 'localStorage' <br/>
-> Session storage and local storage are really straightforward to get work with and we can kind of think of them as like a JSON object or a JavaScript object we'll have key-value pairs that we can interact with by setting them and removing them and updating them <br/>

-> cookies are much more complicated and quite a bit different to work with than session storage and local storage <br/>
-> Unlike session storage and local storage, cookies don't have a very nice interface for interacting with them, the only way we have to interact with cookies is through the 'document.cookie' object and this object both will allow us to see all the cookies and set new cookies <br/>
-> If we wanted to create a new cookie, we would just set the value of cookie equal to the cookie we want to set 
eg:``` document.cookie = 'name=Prudhvi' ```
-> If we wanted to set an expiration date for our cookie, all we have to do is specify when we want it to expire
eg: 
``` document.cookie = "name=Prudhvi; expires=" + new Date(2023,11,21).toUTCString(); ```
``` document.cookie = "lastName=Teja; expires=" + new Date(2023,11,21).toUTCString();```
-> If we want to view the cookies, there is no good way to view the cookies other than viewing all of the cookie information all at once <br/>
-> The only way we have to view is through the 'document.cookie' object
eg:
```	
console.log(document.cookie);	// name=Prudhvi; lastName=Teja 
```


## HTTP Headers and Cookies

#### HTTP Header :

-> It's something that we don't spend a lot of time trying to learn and we frankly don't need to learn a whole lot about them <br/>
-> We do need to specifically learn about an HTTP Header called the set-cookie in the cookie header in order to understand how server-side sessions work and interact with the browser <br/>

-> Open up developer console in Google Chrome and go to the network tab and access to google.com <br/>
-> We're basically doing a GET request to google.com and we'll see a bunch of stuff loading, a lot of these are the resources that run the page or scripts <br/>
-> At the top of network tab, we can see www.google.com, if we click on that we'll see that there are some headers <br/>

-> Headers come in 3 basic categories:
```
	(i) The General Headers  - these can be either request or response related, they're just kind of general meta data about the request such as what is the URL that we're requesting, what type of method are we using, status code etc.,
	(ii) Response Headers
	(iii) Request Headers
```
-> To understand what a cookie is and how it works, we need to focus/know more about the Request and the Response Headers <br/>

-> If we think about an HTTP-Client, it could be anything from an IOT device, someone like us sitting at the desk or at a coffee shop we could think of it as just a laptop or a phone, pretty much anything that connects to the Internet is considered an HTTP-Client <br/>

-> We will have several things that kind of mix between the requests and response <br/>

-> In a particular situation, when we searches google.com, the browser creates a request header which is basically instructions for the server saying what type of data the request wants <br/>

-> The user-agent tells us what browser is requesting the data <br/>

-> We know that HTTP headers are basically meta-data about our HTTP request <br/>
-> We can also do that on the response side which would be set by the server which in this case is Google <br/>
-> So one of Google servers which ever gives us the content that we'll view on the web will set the response headers and these response headers will give additional instructions to the client that requested the data <br/>

-> set-cookie header basically gives us the key-value pairs <br/>

-> The easiest way to understand what a cookie is and how it works is to remember that HTTP protocol is a stateless protocol, in other words it's going to constantly forget what the user has done on the site unless we have a way to remember that, so in other words if we go to Google and sign in to Google then the Google server cinsiders the client that just signed in gave us valid credentials and so what we want to do is to send something back that allows the browser to remember that this user has logged in <br/>
-> If we don't have anything like cookies or local storage probably more modern way to do it, if we don't have these types of persistent storage then every time we refresh the page our state that we had previously where Google considered we logged-in is going to have to be redone <br/>
-> So every time we refresh the page we're gonna have to enter your login credentials which of course is a terrible user experience and any site that does that is gonna lose their users immediately because they're gonna get completely tired of typing in their login credentials <br/>
-> So this is where the set-cookie and cookie headers comes into picture <br/>

Eg:
-> At the moment, when our browser has no cookie is set, we can come back to the network tab and refresh the page <br/>
-> We'll see that we had the google.com and we can open up the response and request headers <br/>
-> In the request headers, it's pretty much the same as what we had before <br/>
-> In the response headers, we once again have these set-cookie headers and what these are doing is, basically just assume may be we just logged-in and Google wants to tell the browser that the client is logged-in and we don't need to really sign-in every time when we've refreshed the page <br/>
-> So what happens is, we have these set-cookie headers and what our browser will do is it says now we have a cookie-set so every request that we make within this domain(google.com in this case) want to attach those cookies that were set based on this set-cookie HTTP header in the response header <br/>
-> So what's going to happen is when we press refresh again, it's going to actually put the stored cookies that the Google server had put into our browser in the request headers <br/>

-> When we reload the page, Google Chrome browser or any browser for that matter is gonna say my default behavior is this is to look up what cookies are currently set in my browser and attach those cookies to every single request for the domain context that it is applicable to which is google.com in this matter <br/>
-> The browser just attaching the cookie to each request is a really powerful thing when it comes to user authentication <br/>
-> Maybe the server can do some sort of logic and say is the user is valid or invalid <br/>
-> If they authenticated correctly then will set the cookie header in the response object and then the browser every time it reloads will attach that cookie and we don't have to re-login with that user again <br/>

Q) And now the real question is how long do we keep that user logged in ?
-> That's a totally arbitrary question but we can do that with the expires piece of the set-cookie HTTP header 

	var date = new Date();
	date.setTime(date.getTime() + 20000); // adding 20 seconds
	document.cookie = "custom2=value; expires=" + date.toUTCString() + ";"	// custom2=value; expires=Wed, 01 Jan 2020 22:11:26 GMT;

-> The cookie actually will drop off after 20 seconds and it will no longer be attached to the HTTP request and that user will say that that was a cookie that gave a user or the clients authentication status that's gone and the user has to re-login in now 


## Node-and-Express-Cookies

-> cookie is a small piece of data stored on the client and after a cookie is set in the client, it is sent alongside every request until it expires or gets cleared <br/>

-> cookie-parser is a middleware that parses cookies attached to the request object and it is similar to the express.json middleware for parsing cookies instead of request payloads <br/>
-> Similar to how express.json middleware parses a post request payload and places it inside the body of the request, the cookie-parser middleware parses cookies attached to their request and places them inside request.cookies <br/>

-> In the login route, we can set the cookies
	Eg: 
    
    res.cookie('username', username , {secure: true});
-> In the logout route, we can clear the cookies
	Eg:

    res.clearCookie('username');
	res.redirect('/login');


## Complete-guide-to-understanding-the-express-session-library

-> Cookie has its data stored in the browser and that browser is going to attach that cookie(key-value pair) to every HTTP request that it does <br/>
-> Session on the other hand is going to be stored on the server-side(i.e., ExpressJS application) <br/>

-> The Express Session is going to store a little-bit bigger types of data and in a Cookie we can't put a whole lot of data and it gets very tedious if we're constantly adding more and more data to the cookie that we're attaching to each request <br/>
-> So it would make sense to put that in a server-side session where we can store much larger amounts of data, in-addition a server-side session is advantageous because with a Cookie we cannot store any sort of 'user credentials' or 'secret information' <br/>
-> If we did that then a hacker could easily get ahold of that information and steal personal data <br/>
-> So the benefit of a session is basically the fact that we have it on our server-side and we're actually authenticating into the session with a secret-key <br/>


connect-mongo  -> A mongoDB-based session store


-> Session is used to store information about a particular user moving throughout the browser or a client and so we can potentially get up to a decent amount of information and therefore in a production environment it would be useful to have an actual database storing that information <br/>
-> The default express-session middleware just comes with its own implementation of a session store but it's not using a database it's just using in memory or memory that's local to our application and it's not going to be a scaleable solution <br/>
-> So what we need to do is set up an actual session store which is a fancy way of saying we need to connect our database to the express-session middleware
Eg:
```
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const MongoStore = require('connect-mongo')(session);

const app = express();

const dbString = "..."; //DBurl
const dbOptions = {
	useNewURlParser: true,
	useUnifiedTopology: true
}

const connection = mongoose.createConnection(dbString,dbOptions);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const sessionStore = new MongoStore({
	mongooseConnection: connection,
	collection: 'sessions'
});

app.use(session({
	secret: 'some secret',
	resave: false,
	saveUninitialized: true,
	store: sessionStore,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24;	//Equals 1 day
	}
}));

app.get('/', (req,res,next) => {
	....
});

app.listen(3000);

```
-> All the session details will be stored inside the 'sessions' collection in the DB

## Examples
-> express-session middleware setup
```
const session = require('express-session');
app.use(session({
	secret: '....',
	cookie: {
		sameSite: 'strict',
	}
}));
```
-> In the login route, we will store the session details
Eg(login route):
```
{
	if(req.body.username && req.body.password) {
		const {username,password} = req.body;
		
		let user = await User.findOne({
			where: {username,password}
		});

		if(user) {
			req.session.user = user;
			req.session.authorized = true;
			res.render(...);
		}
		else {
			res.render('login');
		}
	}
}
```

-> After storing session details through login route, we will authenticate all the protected routes 
Eg:
```
app.get('/', (req,res,next) => {
	if(req.session.authorized) {
		res.render(...);
	}
	else {
		res.render('login');
	}
});
```

-> In the logout route, we will delete the stored details
Eg:
```
app.get('logout', (req,res,next) => {
	req.session.destroy();
	res.redirect('/login');
});
```

## Authentication-Vs-Authorization

They both are related but they are the separate entities

### Authentication:

Authentication is a process to prove that you are the authentic person or not.
Eg:
```
When you try to login to your Gmail account and when you provide correct username and password definitely it will give the access and you can access your Gmail account. If you provide incorrect credentials definitely it will throw the error and ask you to login again. This is called Authentication 
```
### Authorization:

-> Authorization is when you login to your Google account we have multiple products like Gmail, YouTube, Google drive etc <br/>
-> Google also have certain products which are paid like Google AdWords, Google search places etc <br/>
-> Once you paid some amount of money then only you can access that particular product, so you are not authorised but you are authentic person but you are not authorised to use that particular product <br/>


To manage the authentication system, we will be using json web tokens or jwts for short and they are just one way in which we can implement authentication.
It's a very popular way to implement auth into websites and rest apis and it's also extremely flexible too.
Another way to add authentication to our website would be to use sessions.


## JSON-Web-Tokens
-> JWT(json web token) which is basically an encoded long string of characters made up of 3 parts
```
	(i)token header - which is a bit like metadata for the token
	(ii)payload	- the data that is encoded into the jwt and this could be a user-id to identify the user so that when it's decoded on the server we know which user is going to be logged in now and it's important that no sensitive data is put inside this payload
	(iii)signature - the thing that kind of ties everything(header+payload+secret) together and that is used to verify the token on the server
```
-> When our server is creating the JWT after a user successfully login or signup then it creates the header part and the payload part first and encodes them both then to sign the token or to add the signature it takes both of those two parts and it hashes them together with something called a secret which is a secure secret string stored on the server <br/>
-> This secret must remain a secret because it's the key to unlocking the JWT and the only way to verify a token <br/>
-> So we would never publish the secret to any kind of public repository where anyone could see it <br/>
-> So when those 3 things are hashed together it creates the token-signature and that token-signature is then added to the end of the JWT after the other two parts and it can be sent to the browser <br/>
-> The actual hashed resulting token would look something like 
		```	Headers.Payload.Signature ```

-> JWT is then added into a cookie and sent and stored in a browser <br/>
-> So for any subsequent request to the server the token is then received by the server inside that cookie <br/>
-> The server can then verify the token on every request by looking at the header and the payload and hashing them with the secret which remember is stored on the server <br/>
-> If the hashed value of those 2 things with the secret matches the signature which is also the hashed value of those 2 parts and the secret it knows then that it's valid and the JWT has not been tampered(tharu maru cheyadam) with on the client <br/>
-> If the JWT had been tampered with on the client, for example if the data in the payload is modified then those 2 parts either the header or the payload would have been changed the encoded parts and when they're hashed together with the secret they would not match whatever the token-signature is and therefore we would say hey you're not logged in or you're not authenticated anymore <br/>
-> So this whole process of signing and verifying JWTs might sound a little bit complicated but with the help of the 'jsonwebtoken' package, it's actually very easy to implement <br/>

#### Note:
-> The 'jsonwebtoken' package works on callbacks and there are no promises support <br/>
-> So if we want promises support what we can do is, we can use our own Promises <br/>


-> When a client makes a request to the server that is he/she makes a register or login request with his/her username and password the server checks if the username and password is valid <br/>
-> If it is valid then server will send back a pair of tokens that is the "Access tokens" and the "Refresh tokens" <br/>
-> To access any protected-route the client will send his access token as the authorization header to the server and the server verifies whether the authorization header is valid that is the access token is valid and if the access token is valid the server will send back the response <br/>
-> If the token is not valid the server will send back a 401 forbidden response which means or which has the message that is the JWT is expired <br/>
-> And then what the client will do is, the client will send back the server again a request which contains the Refresh token in the request body and then the server verifies that refresh token and if that refresh token is valid then what the server will do server is it will again send back the client a pair of access token and a new refresh token not the old refresh token but a new refresh token and if the Refresh token is not valid or the Refresh token is blacklisted the server will send back HTTP response of 403 that is Unauthorized 


### Q) Why do we need two tokens ?

-> After a successful authentication we are sending back 2 tokens to the client containing the client ID in the payload of the audience claim <br/>

-> It's typical to keep our Refresh tokens validity for so long because they are used to refresh the access tokens <br/>

-> We use the access token to access the protected route but we use the Refresh tokens to get a new pair of access token and refresh token when the access token has been expired <br/>
-> And since our access token has a validity of only a single hour so it can easily expire <br/>
-> Therefore, the Refresh tokens are simply used to get a new pair of access token and refresh token <br/>

-> The Refresh token would be firstly verified that if the Refresh token is valid and secondly it would be checked inside the database that is inside Redis, whether this refresh token exists there <br/>
-> If this refresh token exists there then only it will send a new pair <br/>
-> And after sending a new pair what the server will do is, it will keep that refresh token that is the new refresh token and it will overwrite the old refresh token so that the old refresh token never existed in the server or it has been overwritten by the new refresh token <br/>

-> So if any new request is made by the old refresh token the server will see that the token is valid but it is not present inside redis so it will again send back a 403 response <br/>
-> Here we are making two checks 
	
    firstly whether the token is valid or not and 
	secondly whether the token exists in Redis or not 

-> And to logout the user we can simply remove the access token and refresh token from the client side <br/>
-> As well as, we will also remove the refresh token from Redis database as well that is from the server


### NPM packages needed to make an authentication API
```
jsonwebtoken - is mainly used for authentication
joi - is for a schema validation
bcrypt - uses Blowfish algorithm to encrypt our passwords
dotenv - package to store our environment variables
nodemon - which simply restarts the application
morgan - which simply locks the request inside the console
```

### How-password-hashing-works-under-the-hood

-> When we're hashing a password there's actually 2 steps involved at a basic level <br/>
-> One of those steps is to run our password through a hashing algorithm <br/>
-> Now a hashing algorithm takes in a text password and it generates a longer more seemingly random string <br/>
-> So we can think of this as a bit like a coded password
```
		       -------------------
test1234	------| Hashing Algorithm |-------   A6g34934md....
		       -------------------
```
-> It's already a bit more secure but this alone isn't enough because hackers can reverse engineer simple hashed passwords <br/>
-> So another step is to generate something called a 'Salt' and attach it to the password before it's hashed <br/>
-> Salt is a string of characters separate from the password itself so then the end result is a hashed-password and salt combination which is then stored in the database

```
 		       -------------------
hAjfgtest1234	------| Hashing Algorithm |-------    $5.6A6g34c9....
  |		       -------------------
  |
   -- salt(hAjfg)
```
-> When a user later tries to log in to authenticate themselves, we would take the password they enter to log in with, add the salt to that password, hash it through the same hashing algorithm <br/>
-> Then we compare it with their hashed-password stored in their database which was generated when they signed up, if they match then we know that it's the correct password and we log them in <br/>
-> If they don't match then they're not logged in


## Generating-the-secret-key-for-the-Access-token-and-the-Refresh-token

-> To generate the secret key for the Access token and the Refresh token
Eg:
```
const crypto = require('crypto');   //built-in nodejs module

const key1 = crypto.randomBytes(32).toString('hex');
console.log("key1 = ",key1);
const key2 = crypto.randomBytes(32).toString('hex');
console.log("key2 = ",key2);
```
-> Whenever we think our application is being misused, then we need to generate a new pair of keys for the Access token and the Refresh token and then we should put them inside our environment file and all the tokens which we are generated before  i.e., the Access token and the Refresh token, both the tokens would be invalidated because the key has been changed inside the environment file


## Logging-In-Users

-> We want to take the credentials provided and then we want to look for that user with that email in the database <br/>
-> Once we've got that user then we want to compare the provided password with the hashed-password <br/>
-> So we take the password they try to login with and we hash it and we compare it with the hashed-password stored in the database for the user with that email <br/>
-> If they match then it means the password is correct and we can log them in and create the jsonwebtoken for them and send it back to the browser <br/>
-> If it's incorrect or if they don't match then we don't log them in and we send back some kind of error to the user like incorrect password <br/>
-> We want to basically take credentials and compare them with the email and password in the database and then create a jsonwebtoken <br/>
-> It would be nice if we could do something like this on the user model <br/>
-> mongoose doesn't come with the ability to login users for us, we have to create the method by ourselves and we can create the static method on a model when we create a model <br/>
-> Or we can create anywhere else also, it's just a function and we can create anywhere we wish <br/>
Eg:
```
//static method to login the user
userSchema.statics.login = async function(email,password) {
	const user = await this.findOne({email});
	if(user) {
		const hashedPassword = user.password;
		const auth = await bcrypt.compare(password,hashedPassword);
	
		if(auth) {
			return user;
		}
		throw Error('incorrect password');
	}
	throw Error('incorrect email');
}
```


## Verifying-an-Access-Token

-> To protect the route so that only the authenticated users are able to access the route, firstly we need to send the authentication token or the access token in the request headers <br/>
-> The authorization header should be present inside each and every request which goes to a protected route and this authorization header should contain the token <br/>
-> We should not simply paste a token but it has a certain format, so for that we have to write the "Bearer" first and then we need to provide the token <br/>
-> Let's quickly generate a token through logging-in <br/>
-> This is how we should send our request to a protected route <br/>
Eg:
```
GET http://localhost:4000/...
Authorization: Bearer eyJhbG...
```
-> We are going to use the token inside a middleware that will be putting and to verify that token inside our application what we need to do is, create one more middleware function <br/>
-> If the token is verified, we can simply call it next() or if the token is invalid or the token has some error then we can simply call next() with the error parameter 
Eg:
```
verifyAccessToken: (req,res,next) => {
        if(!req.headers['authorization'])
            return next(createError.Unauthorized());
        
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if(err) {
               const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
               return next(createError.Unauthorized(message));
            }
            req.payload = payload;
            next();
        });
}
```


## Generating-Refresh-Tokens

-> After a certain period of time our access tokens would be expired <br/>
-> And we do not want the client to login back again inside our application but instead we should automatically refresh those access tokens with a new pair of access token and refresh token
Eg:
```
signRefreshToken: (userId) => {
        return new Promise((resolve,reject) => {
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: '1y',
                issuer: 'auth_tutorial project',
                audience: userId,
            }

            JWT.sign(payload,secret,options, (err,token) => {
                if(err)  {
                    console.log(err.message);
                    //return reject(err)
                    return reject(createError.InternalServerError());
                }
                resolve(token)
            })
        }) 
    }
```
-> If we do not provide the expiration time then it would be the lifetime or until we change the 'secret' inside our application 


## Using-Refresh-Tokens-to-generate-New-tokens

-> We want to use the refresh-token only when the access token has been expired and the client gets a message back from the server that the request is unauthorized and the JWT is expired <br/>
-> So we can check that on client-side and then we can send back a request with this refresh-token inside the request body to the server back <br/>
-> When we are doing the blacklisting of the tokens that is the refresh-tokens then we need to do something more inside the verifyRefreshToken() but for now we simply resolve the promise by simply resolving the userId
Eg:
```
//generate refresh-token
router.post("/auth/refresh-token",async(req,res,next) => {
    try {
        const {refreshToken} = req.body;
        if(!refreshToken) 
            throw createError.BadRequest();
        const userId = await verifyRefreshToken(refreshToken);

        const accessToken = await signAccessToken(userId);
        const refToken = await signRefreshToken(userId);

        res.send({accessToken:accessToken, refreshToken:refToken});
    } catch(err) {
        next(err);
    }
});

verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve,reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,payload) => {
                if(err)
                    return reject(createError.Unauthorized());
                
                const userId = payload.aud; //while generating refresh-token we are using userId in the options object and that will be stored in the payload
                resolve(userId);   
            })
        })
}
```


## Introduction-about-Redis

-> Redis stands for REmote DIctionary Server <br/>
-> Redis is developed in 2009 and it is Open Source. <br/>
-> Redis is a data-structure server. <br/>
-> Redis is In-Memory data-structure store and used as DB, Cache, Message Broker. <br/>
-> Redis allows the user to store vast amounts of data without the limits of a relational database. <br/>
-> Redis is NOSQL DB <br/>
-> Unlike traditional databases that run on a computer’s hard disk and store all of their data on disk, Redis runs inside of a system’s working memory (RAM). <br/>
-> This allows Redis to be incredibly fast at fetching data, which is why it’s often used as a cache on top of other databases to improve application performance. <br/>

-> To work with redis or to see what's inside redis in-memory database, we need to install the redis-commander npm package globally so that we can view our redis database in a GUI tool that opens up in a browser

	//To install redis-commander globally
	npm i -g redis-commander

-> redis-commander is used to view what's all inside the redis database that is present locally in our computer <br/>
-> To run the redis-commander, we simply enter the "redis-commander" in cmd and press enter then we can access the browser at localhost:8081 <br/>
-> To connect the redis database using cli, we simply enter the command "redis-cli" and press enter then we can work on redis database using command line

#### Note:
-> If service is already running we will get the error. <br/>
-> As per need we can restart service by below commands:
```
redis-server --service-stop
redis-server redis.windows.conf
```


## Blacklisting-Refresh-Tokens-using-Redis

-> Whenever we sign a new refresh-token because whenever we sign a new refresh-token or we generate a new refresh-token, we want to store it inside Redis cache so that at some point later down if we want to blacklist a token then we have the userId as the key and the value would be the refresh-token <br/>

-> While generating the refresh-token before resolving it, firstly we want to save it inside our Redis cache
```
//to insert the data into the redis DB
client.SET(userId, token, 'EX', 365*24*60*60, (err, reply) => {
	if(err) {
      	console.log(err.message);
            reject(createError.InternalServerError());
            return;
	}
      resolve(token);    
});  
```
-> While verifying the refresh-token, firstly we want to get the data from redis DB and compare it with them
```
//to get data from the redis DB
client.GET(userId, (err, result) => {
	if(err) {
      	console.log(err.message);
            reject(createError.InternalServerError());
            return;
	}
      if(refreshToken === result)
      	return resolve(userId); 
      reject(createError.Unauthorized());
});
```


## Logging-Out-Users

-> We can view protected routes only when we're logged in <br/>
-> To logout of the application, we'd have to manually delete that jwt cookie <br/>
-> But we can't guarantee that our users are going to know how to do that, to go into the application tab and delete that cookie to logout, so that's not going to work <br/>
-> So we need to create a logout route and it should take care of all these things
Eg:
```
router.delete('logout', (req,res,next) => {
	res.cookie('jwt', '', {maxAge:1});	//replacing jwt with empty string and maximumAge with 1 millisecond
	res.redirect('/');
})
```


## Checking-the-Current-User

-> To check the current user who is logged in
```
//checking the current user
router.get('/checkuser', (req,res,next) => {
    const token = req.cookies.jwt;

    if(token) {
	jwt.verify(token, 'secret key', async (err, decodedToken)=> {
		if(err) {
			console.log(err.message);
			res.locals.user = null;
			next();
		}
		else {
			console.log(decodedToken);
			let user = User.findById(decodedToken.id);
			res.locals.user = user; 
			next();
		}
	})
    }
    else {
      res.locals.user = null;
	next();  
    }
});
```

#### Note:
```
-> app.get('*', checkuser);	//applies to all the get requests
```


## Conditional-Rendering

-> '<%' Opening tag for ejs template engine <br/>
-> '%>' Closing tag for ejs template engine <br/>
-> '<% =variableName %>' to use a variable value <br/>

Eg:
```
<ul>
	<% if(user) { %>
		<li>Welcome, <%= user.email %> </li>
		<li><a href='/logout'>Log Out</a> </li>
	<% } else { %>
		<li><a href='/login'>Log in</a> </li>
		<li><a href='/signup' class='btn'>Sign Up</a> </li>
	<% } %>
</ul>
```


## MVC(Model-View-Controller)-Pattern

-> In MVC architecture/MVC pattern all the Model related files should be under 'models' folder, all the view related files should be under 'views' folder and all the action/controller related files should be under 'controllers' folder <br/>
-> All the configuration/connection-setup related files should be under 'helpers/config' folder <br/>
-> In the 'routes' folder, we should import the only related functions here and all the implementations/handler functions should be under the 'actions/controllers' folder


#### Naming Convention
```
|
|- Controllers
|	|
|	|-  Auth.Controller.js
|
|- helpers/config
|	|
|	|-  init_mongodb.js
|	|-  init_redis.js
|	|-  jwt_helper.js
|
|- Models
|	|
|	|-  User.model.js
|
|- Routes
|	|
|	|-  Auth.route.js
```




