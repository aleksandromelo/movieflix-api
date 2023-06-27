// const http = require('http');

// const server = http.createServer((req, res) => {
//    res.setHeader('Content-Type', 'text/plain');
 
//    if (req.url === '/') {
//        res.statusCode = 200;
//        res.end('Home page');
//    } else if (req.url === '/sobre') {
//        res.statusCode = 200;
//        res.end('About page');
//    }
// });

// server.listen(3000, () => {
//  console.log(`Servidor em execução em http://localhost:3000/`);
// });

import { log } from "console";
import express from "express";
import { PrismaClient } from "@prisma/client";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/movies", async (req, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: "asc"
        },
        include: {
            genres: true,
            languages: true
        }
    });
    res.json(movies);
});

app.post("/movies", async (req, res) => {
    const { title, genre_id, language_id, oscar_count, release_date } = req.body;
    try{
        await prisma.movie.create({
            data:{
                title: title,
                genre_id: genre_id,
                language_id: language_id,
                oscar_count: oscar_count,
                release_date: new Date(release_date)
            }
        });
    }catch(error){
        return res.status(500).send({message: "Falha ao cadastrar um filme"});
    }
    res.status(201).send();
});

app.listen(port, () => {
    console.log(`Servidor em execução na porta ${port}`);
});