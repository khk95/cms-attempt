const app = require('./app');

app.set('port', process.env.PORT || 7000);

const server = app.listen(app.get('port'), () => {
    console.log(`[khk] server is running on port: ${ server.address().port }`);
});