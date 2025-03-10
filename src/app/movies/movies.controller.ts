import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { Public } from '../../contexts/auth/decorators/public.decorator';
import { Roles } from '../../contexts/auth/decorators/roles.decorator';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesService } from './movies.service';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({
    summary: 'Get All (Regular users only)',
    description: 'Get a movie from DB or Star Wars API'
  })
  @Roles(UserRole.Regular)
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Get All (Public)',
    description: 'Get every movie from DB and Star Wars API'
  })
  @Public()
  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @ApiOperation({
    summary: 'Create Movie (Admin users only)',
    description: 'Create a new movie (Cannot repeate episode id)'
  })
  @Roles(UserRole.Admin)
  @Post()
  createNewMovie(@Body() dto: CreateMovieDto) {
    return this.moviesService.createNewMovie(dto);
  }

  @ApiOperation({
    summary: 'Update Movie (Admin users only)',
    description:
      'Update a database movie with episode id (Not the ones from the Star Wars API - Cannot repeate episode id)'
  })
  @Roles(UserRole.Admin)
  @Put('/:episodeId')
  update(
    @Body() dto: UpdateMovieDto,
    @Param('episodeId', ParseIntPipe) episodeId: number
  ) {
    return this.moviesService.update(dto, episodeId);
  }

  @ApiOperation({
    summary: 'Update Movie (Admin users only)',
    description:
      'Delete a database movie with episode id (Not the ones from the Star Wars API)'
  })
  @Roles(UserRole.Admin)
  @Delete('/:episodeId')
  delete(@Param('episodeId', ParseIntPipe) episodeId: number) {
    return this.moviesService.delete(episodeId);
  }
}
