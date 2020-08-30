process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || "DEV";
let urlDB;


if (process.env.NODE_ENV === 'DEV') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;

// ============================================
// vencimiento del token
// ============================================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// ============================================
// seed de jwt
// ============================================
process.env.SEED = process.env.SEED || 'SEED-DEV';