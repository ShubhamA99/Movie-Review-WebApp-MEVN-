import mongodb from 'mongodb';

export default class ReviewsDAO{
    static reviews;

    static ObjectId =  mongodb.ObjectId;
    

    static async injectDB(conn){
        if(ReviewsDAO.reviews){
            return;
        }
        try{
            ReviewsDAO.reviews = await conn.db("sample_mflix").collection('reviews');
           
        }catch(e){
            console.error(`unable to establish connection handle in reviewDAO: ${e}`);
        }
    }


    static async addReview(movieId,user,review,date){
        try{
            console.log(movieId,user,review,date);
            const reviewDoc ={
                name : user.name,
                user_id:user._id,
                date,
                review,
                movie_id :new this.ObjectId(movieId),
            };
            
            return await ReviewsDAO.reviews.insertOne(reviewDoc);
        }catch(e){
            console.log(`unable to add review : ${e}`);
            return {error:e};
        }
    }

    static async updateReview(reviewId,userId,review,date){
        try{
            const updateResponse = await ReviewsDAO.reviews.updateOne(
                {user_id:userId,_id:new this.ObjectId(reviewId)},
                {$set:{review,date}},
            );
            return updateResponse
        }catch(e){
            console.log(`unable to update review : ${e}`);
            return {error:e};
        }
    }

    static async deleteReview(reviewId,userId){
        try{
            const deleteResponse = await ReviewsDAO.reviews.deleteOne(
                {user_id:userId,_id:new this.ObjectId(reviewId)},
                
            );
            return deleteResponse
        }catch(e){
            console.log(`unable to update review : ${e}`);
            return {error:e};
        }
    }
}