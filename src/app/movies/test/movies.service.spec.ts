import { HttpModule } from '@nestjs/axios';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Movie } from '@prisma/client';

import { PrismaModule } from '../../../contexts/prisma/prisma.module';
import { PrismaService } from '../../../contexts/prisma/prisma.service';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { MoviesService } from '../movies.service';
import { MovieResponse, MoviesApi } from '../types/movies.types';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: PrismaService,
          useValue: {
            movie: {
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn()
            }
          }
        },
        ConfigService
      ],
      imports: [
        PrismaModule,
        HttpModule,
        ConfigModule.forRoot({ isGlobal: true })
      ]
    }).compile();

    service = module.get(MoviesService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of movies', async () => {
      const dbMovies: Movie[] = [dbMovie];

      const apiMovies: MoviesApi[] = [
        {
          episode_id: 2,
          title: 'The Empire Strikes Back',
          director: 'Irvin Kershner',
          producer: 'Gary Kurtz',
          release_date: '1980-05-21',
          opening_crawl: 'It is a dark time for the Rebellion...',
          characters: [],
          planets: [],
          starships: [],
          vehicles: [],
          species: [],
          created: new Date().toISOString(),
          edited: new Date().toISOString(),
          url: 'http://swapi.dev/api/films/2/'
        }
      ];

      jest
        .spyOn(service['prisma'].movie, 'findMany')
        .mockResolvedValueOnce(dbMovies);
      jest.spyOn(service, 'findAllFromApi').mockResolvedValueOnce(apiMovies);

      const result = await service.findAll();

      expect(result).toEqual(
        [
          newMovie,
          {
            title: 'The Empire Strikes Back',
            director: 'Irvin Kershner',
            producer: 'Gary Kurtz',
            releaseDate: new Date('1980-05-21'),
            openingCrawl: 'It is a dark time for the Rebellion...',
            episodeId: 2,
            isFromExternalApi: true
          }
        ].sort((a, b) => a.episodeId - b.episodeId)
      );
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if movie with the given episode ID does not exist', async () => {
      jest
        .spyOn(service['prisma'].movie, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('should return a movie if it exists with the given episode ID', async () => {
      jest
        .spyOn(service['prisma'].movie, 'findUnique')
        .mockResolvedValueOnce(dbMovie);

      const result = await service.findOne(1);

      expect(result).toEqual(newMovie);
    });
  });

  describe('createNewMovie', () => {
    const createMovieDto: CreateMovieDto = {
      title: 'New Movie',
      director: 'George Lucas',
      producer: 'Gary Kurtz',
      releaseDate: '1998-03-14',
      openingCrawl: 'It is a period of civil war...',
      episodeId: 7
    };

    it('should throw BadRequestException if episode ID already exists', async () => {
      await expect(
        service.createNewMovie({ ...createMovieDto, episodeId: 1 })
      ).rejects.toThrow(BadRequestException);
    });

    it('should create a new movie if episode ID does not exist', async () => {
      jest
        .spyOn(service['prisma'].movie, 'create')
        .mockResolvedValueOnce(dbMovie);

      const result = await service.createNewMovie(createMovieDto);

      expect(result).toEqual(newMovie);
    });
  });

  describe('update', () => {
    const updateMovieDto: UpdateMovieDto = {
      title: 'New Movie updated'
    };

    it('should throw NotFoundException if movie does not exist', async () => {
      jest
        .spyOn(service['prisma'].movie, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(service.update(updateMovieDto, 999)).rejects.toThrow(
        NotFoundException
      );
      expect(service['prisma'].movie.findUnique).toHaveBeenCalledWith({
        where: { episodeId: 999 }
      });
    });

    it('should update a movie if it exists', async () => {
      jest
        .spyOn(service['prisma'].movie, 'findUnique')
        .mockResolvedValueOnce(dbMovie);
      jest
        .spyOn(service['prisma'].movie, 'update')
        .mockResolvedValueOnce({ ...dbMovie, title: updateMovieDto.title });

      const result = await service.update(updateMovieDto, 7);

      expect(result).toEqual({ ...newMovie, title: updateMovieDto.title });
    });
  });

  describe('delete', () => {
    it('should delete a movie if it exists', async () => {
      jest
        .spyOn(service['prisma'].movie, 'findUnique')
        .mockResolvedValueOnce(dbMovie);
      jest
        .spyOn(service['prisma'].movie, 'delete')
        .mockResolvedValueOnce(dbMovie);

      const result = await service.delete(1);

      expect(result).toEqual(newMovie);
    });
  });
});

const dbMovie: Movie = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  title: 'New Movie',
  episodeId: 7,
  director: 'George Lucas',
  producer: 'Gary Kurtz',
  releaseDate: new Date('1998-03-14'),
  openingCrawl: 'It is a period of civil war...'
};

const newMovie: MovieResponse = {
  title: 'New Movie',
  director: 'George Lucas',
  producer: 'Gary Kurtz',
  releaseDate: new Date('1998-03-14'),
  openingCrawl: 'It is a period of civil war...',
  episodeId: 7,
  isFromExternalApi: false
};
