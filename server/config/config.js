process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || "DEV";
let urlDB;

process.env.NODE_ENV = 'production';

if (process.env.NODE_ENV === 'DEV') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://user_test:1234567890@cluster0.j5wpp.mongodb.net/';
}

process.env.urlDB = urlDB;