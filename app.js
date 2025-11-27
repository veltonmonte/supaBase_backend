const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// === Supabase ===
const supabase = supabaseClient.createClient(
    'https://rpiqfmrwlfdummtfjdeu.supabase.co', // link do Supabase
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaXFmbXJ3bGZkdW1tdGZqZGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5OTgyMzQsImV4cCI6MjA3ODU3NDIzNH0._iuQBg2K1DxGoB0yAqtiYdnw4z2pFnJTHaOx9cNTCog'
);

// === Endpoints ===

// Lista todos os produtos
app.get('/products', async (req, res) => {
    const { data, error } = await supabase.from('products').select();
    if (error) return res.status(500).json({ error });
    res.json(data);
});

// Busca produto por ID
app.get('/products/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select()
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error });
    res.json(data);
});

// Cria novo produto
app.post('/products', async (req, res) => {
    const { data, error } = await supabase.from('products').insert({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
    }).select();
    if (error) return res.status(500).json({ error });
    res.json(data); // retorna o produto criado
});

// Atualiza produto
app.put('/products/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        })
        .eq('id', req.params.id)
        .select();
    if (error) return res.status(500).json({ error });
    res.json(data); // retorna o produto atualizado
});

// Deleta produto
app.delete('/products/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id)
        .select();
    if (error) return res.status(500).json({ error });
    res.json(data); // retorna o produto deletado
});

// Rota raiz
app.get('/', (req, res) => {
    res.send("Hello I am working my friend Supabase <3");
});

// Start do servidor
app.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
});

