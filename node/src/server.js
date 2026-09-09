const app = require('./app');
const env = require('./config/env');

app.listen(env.PORT, () => {
  console.log(`Bijengwa API listening on port ${env.PORT}`);
});
