const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// --------------------
//  CORS CORRIGIDO
// --------------------
const corsOptions = {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type'
};

app.use(cors(corsOptions));

// Logs
app.use(morgan('combined'));

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// -----------------------------
//  CONEXÃO COM SUPABASE
// -----------------------------
const supaBaseURL = "https://rpiqfmrwlfdummtfjdeu.supabase.co";
const supaBaseKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaXFmbXJ3bGZkdW1tdGZqZGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5OTgyMzQsImV4cCI6MjA3ODU3NDIzNH0._iuQBg2K1DxGoB0yAqtiYdnw4z2pFnJTHaOx9cNTCog";

const supabase = 
    supabaseClient.createClient(supaBaseURL, supaBaseKEY)

// -----------------------------
//  ROTAS
// -----------------------------

// Listar todos os produtos
app.get('/products', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select('*');

    if (error) return res.status(400).send(error);

    res.send(data);
});

// Buscar produto por ID
app.get('/products/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', req.params.id);

    if (error) return res.status(400).send(error);

    res.send(data);
});

// Criar produto
app.post('/products', async (req, res) => {
    const { name, price } = req.body;

    const { data, error } = await supabase
        .from('products')
        .insert([{ name, price }]);

    if (error) return res.status(400).send(error);

    res.send(data);
});

// Deletar produto
app.delete('/products/:id', async (req, res) => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(400).send(error);

    res.send({ message: 'deleted' });
});

// Página inicial
app.get('/', (req, res) => {
    res.send("API running 🚀");
});

// -----------------------------
//  Subir servidor
// -----------------------------
app.listen(3000, () => {
    console.log('> Running on http://localhost:3000');
});
