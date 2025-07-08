export type TBorrow = {
    totalQuantity: number
    book: Book
}

export type Book = {
    title: string
    isbn: string
}


export interface ErrorResponse {
    data: {
        message: string;
    }
}