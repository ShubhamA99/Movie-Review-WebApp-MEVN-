<template>
  <div class="card">
    <div class="card-header">
      {{ movie.title }}
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6 col-sm-12">
          <img v-if="movie.poster" :src="movie.poster" class="card-img-top" />
        </div>
        <div class="col-md-6 col-sm-12">
          <p class="card-text">{{ movie.plot }}</p>
          <div>
            <AddReview
              v-if="$store.state.user.id"
              :movieId="movie._id"
              v-on:update-movie-info="getMovies()"
            />
          </div>
          <hr />
          <h3>Reviews</h3>
          <ul class="list-group">
            <li class="list-group-tem pb-3 pt-3" v-for="review in movie.reviews" :key="review._id">
              <h5 class="card-title">Review by {{ review.name }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ getFormattedDate(review.date) }}</h6>
              <p class="card-text">{{ review.review }}</p>
              <p v-if="!review.editing" class="card-text">{{ review.review }}</p>
              <p v-if="review.editing" class="card-text">
                <input v-model="newReviewMessage" type="text" class="form-control" />
              </p>
              <a
                v-if="verifyAuthorship(review.user_id)"
                v-on:click="editReview(review)"
                class="btn btn-primary me-3"
              >
                {{ EditText }}
              </a>
              <a
                v-if="verifyAuthorship(review.user_id)"
                v-on:click="deleteReview(review._id)"
                class="btn btn-danger"
              >
                Delete
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MovieService from "../service/MovieService";
import * as moment from "moment";
import AddReview from "../components/AddReview.vue";
import ReviewService from "../service/ReviewService";

export default {
  name: "Movie",
  components: {
    AddReview,
  },
  data() {
    return {
      movie: {
        poster: "",
        title: "",
        rated: "",
        plot: "",
        _id: "",
        reviews: [],
      },
      newReviewMessage: "",
      EditText: "Edit",
    };
  },
  created() {
    this.getMovies();
  },
  methods: {
    async getMovies() {
      const MovieData = await MovieService.getMovie(this.$route.params.id);
      const modifiedReviews = MovieData.reviews.map((v) => ({ ...v, editing: false }));
      MovieData.reviews = modifiedReviews;

      this.movie = MovieData;
    },
    getFormattedDate(date) {
      return moment(date).format("Do MMMM YYYY");
    },
    verifyAuthorship(reviewUserId) {
      if (this.$store.state.user.id && this.$store.state.user.id === reviewUserId) {
        return true;
      }
      return false;
    },
    editReview(review) {
      if (review.editing) {
        review.review = this.newReviewMessage;
        this.saveUpdatedReview(review);
        review.editing = false;
      } else {
        this.newReviewMessage = review.review;
        review.editing = true;
        this.EditText = "Save";
      }
    },
    async saveUpdatedReview(newReview) {
      const data = {
        review: newReview.review,
        name: newReview.name,
        user_id: newReview.user_id,
        movie_id: newReview.movie_id,
        review_id: newReview._id,
      };
      await ReviewService.udateReview(data);
      this.EditText = "Edit";
    },
    async deleteReview(reviewId) {
      const data = {
        user_id: this.$store.state.user.id,
        review_id: reviewId,
      };
      await ReviewService.deleteReview(data);
      this.getMovies();
    },
  },
};
</script>

<style>
.card-body {
  text-align: left;
}
</style>
