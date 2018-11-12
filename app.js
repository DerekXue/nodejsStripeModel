//entry point
const express = require('express');
const keys = require('./config/keys')
// const stripe = require('stripe')('sk_test_EZF4ILlvdn0YuTh3fJs2VU1q');
const stripe = require('stripe')(keys.stripeSecretKey)
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

const port = process.env.PORT || 5000;

//Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Set static folder
app.use(express.static(`${__dirname}/public`));

//Index Route
app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey: keys.stripePushliableKey
    });
})

//Charge route
app.post('/charge', (req, res) => {
    const amount = 2500;

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
        .then(customer => stripe.charges.create({
            amount,
            description: 'Web Development Ebook',
            currency: 'usd',
            customer: customer.id
        }))
        .then(charge => res.render('success'));
});

app.get('/success', (req, res) => {
    res.render('success')
})

app.get('/fuck', (req, res) => {
    res.send('cannot fuckin post')
})



app.listen(port, () => {
    console.log(`Server staterd on port ${port}`);
})