const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// -----------------------------------------
//  CORS — configuração correta
// -----------------------------------------
app.use(cors({
    origin: '*',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Logs
app.use(morgan('combined'));

// Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -----------------------------------------
//  SUPABASE
// -----------------------------------------
const supaBaseURL = "https://rpiqfmrwlfdummtfjdeu.supabase.co";
const supaBaseKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaXFmbXJ3bGZkdW1tdGZqZGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5OTgyMzQsImV4cCI6MjA3ODU3NDIzNH0._iuQBg2K1DxGoB0yAqtiYdnw4z2pFnJTHaOx9cNTCog";

const supabase = createClient(supaBaseURL, supaBaseKEY);

// -----------------------------------------
//  ROTAS
// -----------------------------------------

// Listar todos
app.get('/products', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select('*');

    if (error) return res.status(500).send(error);

    res.send(data);
});

// Buscar por ID
app.get('/products/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (error) return res.status(500).send(error);

    res.send(data);
});

// Criar
app.post('/products', async (req, res) => {
    const { name, price } = req.body;

    const { data, error } = await supabase
        .from('products')
        .insert([{ name, price }])
        .select();

    if (error) return res.status(500).send(error);

    res.send(data);
});

// Deletar
app.delete('/products/:id', async (req, res) => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).send(error);

    res.send({ message: "deleted" });
});

// Home
app.get('/', (req, res) => {
    res.send("API running 🚀");
});

// -----------------------------------------
app.listen(3000, () => {
    console.log("> Running on http://localhost:3000");
});
