
import mongodb from 'mongodb'


export default class MoviesDAO{
    static movies;

    static ObjectId = mongodb.ObjectId;

    static async injectDB(conn){
        if(MoviesDAO.movies){
            return;
        }
        try{
            MoviesDAO.movies = await conn.db("sample_mflix").collection('movies');

        }catch(e){
            console.log(`unable to conect in MoviesDAO : ${e}`);
        }
    }

    static async getMovies({
        filters = null,
        page=0,
        moviesPerPage = 0,
    }={}){
        let query;
        if(filters){
            if('title' in filters){
                query ={$text:{$search:filters.title}};
            }else if('rated' in filters){
                query ={rated:{$eq:filters.rated}};
            }
        }
        
        let cursor;
        try{
        cursor = await MoviesDAO.movies
                                    .find(query)
                                        .limit(moviesPerPage)   // same as LIMIT in SQL 
                                            .skip(moviesPerPage * page) 
                                                            //This allows us to implement pagination later on in the frontend because we
                                                            // can retrieve a specific page ’ s result. For e.g. if the specific page is 1, we
                                                            // skip 20 results first ( moviesPerPage * 1 ) and then retrieve the next 20 results. If
                                                            // the specified page is 2, we skip 40 results ( moviesPerPage * 2 ) and then retrieve
                                                            // the next 20 results
       
          const moviesList = await cursor.toArray();
          const totalNumOfMovies = await MoviesDAO.movies.countDocuments(query);                                             
            return{moviesList,totalNumOfMovies}
        }catch(e){
                console.log(`Unable to issue Find Command ,${e}`);
                return{moviesList:[],totalNumOfMovies:0}
        }
    }


    static async getRatings(){
        let ratings =[]
        try{
            ratings = await MoviesDAO.movies.distinct('rated');
            return ratings
        }catch(e){
            console.log(`unable to get ratings ,${e}`);
            return ratings;
        }
    }


    static async getMoviesById(id){
        try{
            return await MoviesDAO.movies.aggregate([
                {
                    $match:{
                        _id:new this.ObjectId(id),
                    },
                },
                {
                    $lookup:{
                        from:'reviews',
                        localField:'_id',
                        foreignField:'movie_id',
                        as:'reviews'
                    },
                },
            ]).next();
        }catch(e){
            console.log(`something went wrong getMoviesById :  ${e}`);
            throw e;
        }
    }

}