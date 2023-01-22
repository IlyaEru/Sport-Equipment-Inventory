import express from 'express';
import connectDB from './config/db';
import dotenv from 'dotenv';

import router from './routes';

dotenv.config();

const app = express();

// Connect Database
connectDB();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use(express.static('public'));

app.use(router);

// temporarily error handler
const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('500', {
    title: '500 Error: Internal server error.',
    errorMessage: err.message,
  });
};

app.use(errorHandler);
app.use((req, res) => {
  res.render('404', { title: '404' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
