const router = require('./src/app-router');
const application = new router.AppRouter();
application.startApplication(() => {
  console.log('application started');
});
