var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true })

nightmare
  .goto('https://boiling-spire-42319.herokuapp.com/login')
  .type('[name=email]', 'admin')
  .type('[name=password]', 'abc123')
  .click('[type=submit]')
  .wait('.row')
  .evaluate(function () {
    return document.querySelector('#main .searchCenterMiddle li a').href
  })
  .end()
  .then(function (result) {
    console.log(result)
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });
