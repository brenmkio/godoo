
export interface DBReturn<T> {
    db_data: T | null,
    db_error: DBError | null,
}

export interface DBError {
    statusCode: number,
    name: string,
    message: string,
}
