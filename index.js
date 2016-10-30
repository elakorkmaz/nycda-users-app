const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      pug = require('pug'),
      fs = require('fs');

var app = express(),
    userStore = JSON.parse(fs.readFileSync('users.json'));

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'pug');

app.get('/', (request, response) => {
  response.render('users/index', { users: userStore });
});

app.get('/search', (request, response) => {
  response.render('search');
});

app.post('/search', (request, response) => {
  console.log(request.body);
  response.redirect('/search/' + request.body.query);
});

app.get('/search/*', (req, res) => {
  var results = searchUsers(req.params[0]);
  res.render('search-result.pug', { results: results });
});

app.get('/form', (request, response) => {
  response.render('form.pug');
});

app.post('/form', (request, response) => {
  userStore.push(request.body);

  response.redirect('/');

  fs.writeFile('users.json', JSON.stringify(userStore), (error, data) => {
    if (error) {
      throw error;
    }
  });
});

app.get('/form', (req, res) => {
  res.render('form.pug');
});

app.listen(3000, () => {
  console.log('Web Server is running on port 3000');
});

function searchUsers(input) {
  var results = [];

  for (var i = 0; i < userStore.length; i++) {
    if (searchFirstName(input, userStore[i]) || searchLastName(input, userStore[i])) {
      results.push(userStore[i]);
    }
  }

  return results;
}

function searchFirstName(input, user) {
  return user.firstname.toLowerCase().includes(input.toLowerCase());
}

function searchLastName(input, user) {
  return user.lastname.toLowerCase().includes(input.toLowerCase());
}
