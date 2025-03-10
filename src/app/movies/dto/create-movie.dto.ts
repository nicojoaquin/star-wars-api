import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The title of the movie',
    example: 'Movie Title'
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  director: string;

  @IsNotEmpty()
  @IsString()
  producer: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'The release date of the movie',
    example: '1998-07-15'
  })
  releaseDate: string;

  @IsNotEmpty()
  @IsString()
  openingCrawl: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The episode ID of the movie',
    example: 7
  })
  episodeId: number;
}
