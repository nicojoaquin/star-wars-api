import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Movie } from '@prisma/client';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

import { PrismaService } from '../../contexts/prisma/prisma.service';
import { FILMS_ENDPOINT } from './constants';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {
  MovieResponse,
  MoviesApi,
  MoviesApiResponse
} from './types/movies.types';

@Injectable()
export class MoviesService {
  private apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private config: ConfigService,
    private prisma: PrismaService
  ) {
    this.apiUrl = this.config.get<string>('STAR_WARS_API_URL');
  }

  async findAllFromApi(): Promise<MoviesApi[]> {
    try {
      const response: AxiosResponse<MoviesApiResponse> = await firstValueFrom(
        this.httpService.get<MoviesApiResponse>(
          `${this.apiUrl}/${FILMS_ENDPOINT}`
        )
      );

      return response?.data?.results || [];
    } catch {
      throw new BadRequestException('Failed to reach API server');
    }
  }

  async findOneFromApi(episodeId: number): Promise<MoviesApi> {
    try {
      const results = await this.findAllFromApi();

      const movieByEpisode = results.find(
        movie => movie.episode_id === episodeId
      );

      return results.length > 0 ? movieByEpisode : null;
    } catch {
      throw new BadRequestException('Failed to reach API server');
    }
  }

  private formatMovieFromApi(apiMovie: MoviesApi): MovieResponse {
    const {
      director,
      producer,
      episode_id,
      opening_crawl,
      release_date,
      title
    } = apiMovie ?? {};

    return {
      title,
      director,
      producer,
      openingCrawl: opening_crawl,
      episodeId: episode_id,
      releaseDate: new Date(release_date),
      isFromExternalApi: true
    };
  }

  private formatMovieFromDb(movie: Movie): MovieResponse {
    const { director, producer, episodeId, openingCrawl, releaseDate, title } =
      movie ?? {};

    return {
      title,
      director,
      producer,
      openingCrawl,
      episodeId,
      releaseDate,
      isFromExternalApi: false
    };
  }

  async checkEpisodeId(episodeId: number): Promise<boolean> {
    const [dbMovie, apiMovie] = await Promise.all([
      this.prisma.movie.findUnique({
        where: { episodeId }
      }),
      this.findOneFromApi(episodeId)
    ]);

    return !!dbMovie || !!apiMovie;
  }

  async findOne(episodeId: number): Promise<MovieResponse> {
    const movieFromDb = await this.prisma.movie.findUnique({
      where: { episodeId }
    });

    if (movieFromDb) return this.formatMovieFromDb(movieFromDb);

    const movieFromApi = await this.findOneFromApi(episodeId);

    if (!movieFromApi) throw new NotFoundException('Movie not found');

    return this.formatMovieFromApi(movieFromApi);
  }

  async findAll(): Promise<MovieResponse[]> {
    const resultsMoviesFromDb = await this.prisma.movie.findMany();
    const moviesFromDb = resultsMoviesFromDb.map(movie =>
      this.formatMovieFromDb(movie)
    );

    const resultsMoviesFromApi = await this.findAllFromApi();
    const moviesFromApi = resultsMoviesFromApi.map(movie =>
      this.formatMovieFromApi(movie)
    );

    const movies = [...moviesFromDb, ...moviesFromApi];

    return movies.sort((a, b) => a.episodeId - b.episodeId);
  }

  async createNewMovie(dto: CreateMovieDto): Promise<MovieResponse> {
    const movieExistsWithEpisodeId = await this.checkEpisodeId(dto.episodeId);

    if (movieExistsWithEpisodeId)
      throw new BadRequestException('There is a movie with this episode id');

    const movie = await this.prisma.movie.create({
      data: { ...dto, releaseDate: new Date(dto.releaseDate) }
    });

    return this.formatMovieFromDb(movie);
  }

  async update(dto: UpdateMovieDto, episodeId: number): Promise<MovieResponse> {
    const movie = await this.prisma.movie.findUnique({
      where: { episodeId }
    });

    if (!movie) throw new NotFoundException('Movie not found in database');

    if (dto.episodeId && dto.episodeId !== movie.episodeId) {
      const movieExistsWithEpisodeId = await this.checkEpisodeId(dto.episodeId);

      if (movieExistsWithEpisodeId)
        throw new BadRequestException('There is a movie with this episode id');
    }

    const updatedMovie = await this.prisma.movie.update({
      where: { id: movie.id },
      data: {
        ...dto,
        ...(dto.releaseDate && { releaseDate: new Date(dto.releaseDate) })
      }
    });

    return this.formatMovieFromDb(updatedMovie);
  }

  async delete(episodeId: number): Promise<MovieResponse> {
    const movie = await this.prisma.movie.findUnique({
      where: { episodeId }
    });

    if (!movie) throw new NotFoundException('Movie not found in database');

    const deletedMovie = await this.prisma.movie.delete({
      where: { id: movie.id }
    });

    return this.formatMovieFromDb(deletedMovie);
  }
}
