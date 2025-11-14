//import express from 'express';
const express = require('express');

//import createClient from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
//import {createClient} from '@supabase/supabase-js'
const supabaseClient = require('@supabase/supabase-js');

//import morgan from 'morgan';
const morgan = require('morgan');

//import bodyParser from "body-parser";
const bodyParser = require('body-parser');

//import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";

const app = express();

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration


// using morgan for logs
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const supaBaseURL = "https://rpiqfmrwlfdummtfjdeu.supabase.co";
const supaBaseKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaXFmbXJ3bGZkdW1tdGZqZGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5OTgyMzQsImV4cCI6MjA3ODU3NDIzNH0._iuQBg2K1DxGoB0yAqtiYdnw4z2pFnJTHaOx9cNTCog";

const supabase = 
    supabaseClient.createClient(supaBaseURL, supaBaseKEY)


app.get('/products', async (req, res) => {
    const {data, error} = await supabase
        .from('products')
        .select()
    res.send(data);
    console.log(`lists all products${data}`);
});

app.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    console.log("id = " + productId);
    
    const { data, error } = await supabase
        .from('products')
        .select()
        .eq('id', productId);
    
    // --- Solução APLICADA AQUI ---
    if (error) {
        console.error("Supabase Error:", error);
        return res.status(500).send({ message: "Database error", error: error.message });
    }
    
    // Log do objeto ANTES de enviar. Use a vírgula para logar o objeto corretamente.
    console.log("Retorno:", data); // Isso deve mostrar o array de produtos.

    // Se o array estiver vazio, o Supabase retornou vazio.
    if (!data || data.length === 0) {
        return res.status(404).send({ message: "Product not found" });
    }

    res.send(data[0]); // O Supabase retorna um array, mas para um ID específico, você geralmente envia o primeiro elemento.
});

app.post('/products', async (req, res) => {
    const {error} = await supabase
        .from('products')
        .insert({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        })
    if (error) {
        res.send(error);
    }
    res.send("created!!");
    console.log("retorno "+ req.body.name);
    console.log("retorno "+ req.body.description);
    console.log("retorno "+ req.body.price);

});

app.put('/products/:id', async (req, res) => {
    const {error} = await supabase
        .from('products')
        .update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        })
        .eq('id', req.params.id)
    if (error) {
        res.send(error);
    }
    res.send("updated!!");
});

app.delete('/products/:id', async (req, res) => {
    console.log("delete: " + req.params.id);
    const {error} = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id)
    if (error) {
        res.send(error);
    }
    res.send("deleted!!")
    console.log("delete: " + req.params.id);

});

app.get('/', (req, res) => {
    res.send("Hello I am working my friend Supabase <3");
});

app.listen(3000, "0.0.0.0", () => {
    console.log("> Ready on http://0.0.0.0:3000");
});
