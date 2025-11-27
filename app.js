const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const supaBaseURL = "https://rpiqfmrwlfdummtfjdeu.supabase.co";
const supaBaseKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaXFmbXJ3bGZkdW1tdGZqZGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5OTgyMzQsImV4cCI6MjA3ODU3NDIzNH0._iuQBg2K1DxGoB0yAqtiYdnw4z2pFnJTHaOx9cNTCog";

const supabase = supabaseClient.createClient(supaBaseURL, supaBaseKEY);


// ------------------- GET ALL PRODUCTS -------------------
app.get('/products', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select();

    if (error) {
        console.error("Error GET /products:", error);
        return res.status(500).send(error);
    }

    console.log("Listando produtos:", data);
    return res.json(data);
});


// ------------------- GET PRODUCT BY ID -------------------
app.get('/products/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select()
        .eq('id', req.params.id);

    if (error) {
        console.error("Error GET /products/:id:", error);
        return res.status(500).send(error);
    }

    return res.json(data);
});


// ------------------- CREATE PRODUCT -------------------
app.post('/products', async (req, res) => {
    const { name, description, price } = req.body;

    const { error } = await supabase
        .from('products')
        .insert({ name, description, price });

    if (error) {
        console.error("Error POST /products:", error);
        return res.status(500).send(error);
    }

    console.log("Produto criado:", name);
    return res.send("created!!");
});


// ------------------- UPDATE PRODUCT -------------------
app.put('/products/:id', async (req, res) => {
    const { name, description, price } = req.body;

    const { error } = await supabase
        .from('products')
        .update({ name, description, price })
        .eq('id', req.params.id);

    if (error) {
        console.error("Error PUT /products:", error);
        return res.status(500).send(error);
    }

    return res.send("updated!!");
});


// ------------------- DELETE PRODUCT -------------------
app.delete('/products/:id', async (req, res) => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id);

    if (error) {
        console.error("Error DELETE /products:", error);
        return res.status(500).send(error);
    }

    console.log("Produto deletado:", req.params.id);
    return res.send("deleted!!");
});


// ------------------- ROOT -------------------
app.get('/', (req, res) => {
    res.send("Hello I am working my friend Supabase <3");
});


// ------------------- START SERVER -------------------
app.listen(3000, '0.0.0.0', () => {
  console.log('Server ON on port 3000...');
});
