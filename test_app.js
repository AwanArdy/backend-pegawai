const app = require('./dist/app').default;
const request = require('supertest');
request(app).get('/health').then(res => {
  console.log('Status:', res.status);
  console.log('Body:', res.body);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
