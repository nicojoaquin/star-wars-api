import { PaginationOptionsDto } from '../dto/pagination-options.dto';

export enum Order {
  ASC = 'asc',
  DESC = 'desc'
}

export type PageMetaDtoParameters = {
  pageOptionsDto: PaginationOptionsDto;
  itemCount: number;
};
