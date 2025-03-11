export type CreateMoviePayload = {
  name: string;
  description: string;
  movieImage: Express.Multer.File;
};
