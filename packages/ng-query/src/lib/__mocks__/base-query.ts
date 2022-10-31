const { baseQuery: originImpl } = jest.requireActual('../base-query');

export const baseQuery = jest.fn(originImpl);
