import { Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate'

export const paginate = jest
  .fn()
  .mockImplementation(
    async <T>(options: IPaginationOptions): Promise<Pagination<T>> => {
      return {
        items: [],
        meta: {
          itemCount: 0,
          totalItems: 0,
          itemsPerPage: Number(options.limit),
          totalPages: 1,
          currentPage: Number(options.page),
        },
      }
    },
  )
