const app = require('../app');
const request = require('supertest');
const { Movies, Users } = require('../config/index');
const { encrypt } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');
const mongoose = require('mongoose');

//User Data
let user = {
  email: 'test@mail.com',
  password: encrypt('123')
}

//Movie Data
let movie = { 
	"name": "Detective Conan Movie 07: Crossroad in the Ancient Capital", 
	"poster": "https://image.tmdb.org/t/p/w500/zjVioQAc9svSjZ4ew7KVlJr8xcc.jpg", 
	"popularity": "7.87", 
	"description": "Detective Conan Movie 07: Crossroad in the Ancient Capital menceritakan tentang CROSSROAD IN THE ANCIENT CAPITAL Conan dan Heiji diduga terlibat atas pembunuhan berantai, kejadian itu membawa mereka ke sebuah kota, yang penuh misteri dan membingungkan dalam menyelesaikan kasusnya. Heiji sedang mengingat-ingat sesuatu pada masa kecilnya yang mengantarkan sebuah keputusan penting untuk mengungkapkan kasus misteri yang selama ini sedang ditanganinya. Sementara itu, setelah mengalami kegagalan dalam suatu penyerangan, Heiji mengahadapi masalah baru yakni Kuzuha menyandera teman wanita di masa kecil. Kemudian setelah mengalami kegagalan dan pertempuran, Heiji tak sanggup untuk membebaskan dan menyelamatkan sandera tersebut. Namun hanya ada satu yang sanggup.", 
	"tags": ["Adventure", "Comedy", "Mystery", "Police", "Shounen"]
}

let token = '';
let movieId = '';

//Set data to mongoDB
beforeAll((done) => {
  Users.create(user)
    .then(data => {
      userId = data._id;
      token = generateToken({id: data._id})
      Movies.create(movie)
        .then(movieData => {
          movieId = movieData._id;
          return done();
        })
    })
    .catch(err => {
      return done(err);
    })
})

//Destroy data in mongoDB
afterAll((done) => {
  Users.deleteMany({})
    .then(() => {
        Movies.deleteMany({})
        .then(() => {
            return done();
        })
        .catch(err => {
            return done(err);
        })
    })
    .catch(err => {
        return done(err);
    })
})

describe('User services', () => {
  describe('Success services', () => {
    test('POST /register', (done) => {
      request(app)
        .post('/register')
        .send({
            email: 'test2@mail.com',
            password: '123'
        })
        .end((err, res) => {
          if(err) {
              return done(err);
          } else {
              expect(res.status).toBe(201);
              return done();
          }
        })
    })

    test('POST /login', (done) => {
      request(app)
        .post('/login')
        .send({
            email: 'test@mail.com',
            password: '123'
        })
        .end((err, res) => {
          if(err) {
              return done(err);
          } else {
              expect(res.status).toBe(200);
              return done();
          }
        })
    })   
  })

  describe('Failed services', () => {
    test('POST /register', (done) => {
      request(app)
        .post('/register')
        .send({
            email: 'test',
            password: '123'
        })
        .end((err, res) => {
          if(err) {
              return done(err);
          } else {
              expect(res.status).toBe(400);
              return done();
          }
        })
    })  
    
    test('POST /login (invalid password)', (done) => {
      request(app)
        .post('/login')
        .send(user)
        .end((err, res) => {
          if(err) {
              return done(err);
          } else {
              expect(res.status).toBe(400);
              return done();
          }
        })
    }) 

    test('POST /login (invalid email)', (done) => {
      request(app)
        .post('/login')
        .send({
          email: 'test',
          password: '123'
        })
        .end((err, res) => {
          if(err) {
              return done(err);
          } else {
              expect(res.status).toBe(400);
              return done();
          }
        })
    }) 
  })
});

describe('Movie services', () => {
  describe('Success services', () => {
    test('POST /add', (done) => {
      request(app)
        .post('/add')
        .set('token', token)
        .send(movie)
        .end((err, res) => {
          if(err) {
              return done(err);
          } else {
              expect(res.status).toBe(201);
              return done();
          }
        })
    })

    test('GET /', (done) => {
      request(app)
        .get('/')
        .end((err, res) => {
          if(err) {
              return done(err);
          } else {
              expect(res.status).toBe(200);
              return done();
          }
        })
    })  

    test('GET /detail/:id', (done) => {
      request(app)
        .get('/detail/' + movieId)
        .end((err, res) => {
          if(err) {
              return done(err);
          } else {
              expect(res.status).toBe(200);
              return done();
          }
        })
    })

    test('PUT /edit/:id', (done) => {
      request(app)
        .put('/edit/' + movieId)
        .set('token', token)
        .send({ ...movie, name: 'Hotaru no Haka' })
        .end((err, res) => {
          if(err) {
              return done(err);
          } else {
              expect(res.status).toBe(200);
              return done();
          }
        })
    })

    test('DELETE /delete/:id', (done) => {
      request(app)
        .delete('/delete/' + movieId)
        .set('token', token)
        .end((err, res) => {
          if(err) {
              return done(err);
          } else {
              expect(res.status).toBe(200);
              return done();
          }
        })
    })
  })

  describe('Failed services', () => {
    test('POST /add', (done) => {
      request(app)
        .post('/add')
        .set('token', token)
        .send({ ...movie, popularity: 'tujuh' })
        .end((err, res) => {
          if(err) {
              return done(err);
          } else {
              expect(res.status).toBe(400);
              return done();
          }
        })
    })

    // test('GET /', (done) => {
    //   request(app)
    //     .get('/')
    //     .end((err, res) => {
    //         if(err) {
    //             return done(err);
    //         } else {
    //             expect(res.status).toBe(400);
    //             return done();
    //         }
    //     })
    // })  

    test('GET /detail/:id', (done) => {
      request(app)
        .get('/detail/' + 'id')
        .end((err, res) => {
          if(err) {
              return done(err);
          } else {
              expect(res.status).toBe(500);
              return done();
          }
        })
    })

    test('PUT /edit/:id', (done) => {
      request(app)
        .put('/edit/' + 'id')
        .set('token', token)
        .send(movie)
        .end((err, res) => {
          if(err) {
              return done(err);
          } else {
              expect(res.status).toBe(500);
              return done();
          }
        })
    })

    test('DELETE /delete/:id', (done) => {
      request(app)
        .delete('/delete/' + 'id')
        .set('token', token)
        .end((err, res) => {
          if(err) {
              return done(err);
          } else {
              expect(res.status).toBe(500);
              return done();
          }
        })
    })
    
    test('Unauthorized because there are no tokens', (done) => {
      request(app)
        .post('/add')
        .send(movie)
        .end((err, res) => {
          if(err) {
              return done(err);
          } else {
              expect(res.status).toBe(401);
              return done();
          }
        })
    })

    test('Unauthorized because token is incorrect', (done) => {
      request(app)
        .put('/edit/' + movieId)
        .set('token', generateToken({ id: 'undefined' }))
        .send(movie)
        .end((err, res) => {
          if(err) {
              return done(err);
          } else {
              expect(res.status).toBe(401);
              return done();
          }
        })
    })
  })
});