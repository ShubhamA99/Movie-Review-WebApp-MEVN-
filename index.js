import express from 'express'
import cors from 'cors'
import MoviesRoute from './api/MoviesRoute.js'
import dotenv from 'dotenv'
import mongodb from 'mongodb'
import MoviesDAO from  './dao/MovieDAo.js'
import ReviewsDAO from './dao/ReviewsDAO.js'

class Index{
    static app =express();

    static router = express.Router();

    static main(){
        dotenv.config();
        Index.setUpServer();
        Index.setUpDatabase();
    }

    static setUpServer(){
        Index.app.use(cors());
        Index.app.use(express.json());

        Index.app.use('/api/v1/movies',MoviesRoute.configRoutes(Index.router));
        Index.app.use('*',(req,res)=>{
            res.status(404).json({error:"Not Found"});
        })
    }

    static async setUpDatabase(){
        const client = new mongodb.MongoClient("mongodb+srv://admin:admin123@cluster0.gybredy.mongodb.net/sample?retryWrites=true&w=majority");
        const PORT = process.env.PORT || 8000;
        try{
            await client.connect();
            await MoviesDAO.injectDB(client);
           
            await ReviewsDAO.injectDB(client);
            Index.app.listen(PORT,()=>{
                console.log(`Server is running  :http://localhost:${PORT}`);
            })
        }catch(e){
            process.exit(1)
        }
    }

}

Index.main();