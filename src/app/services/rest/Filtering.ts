/**
 * Filtering object used as a search criteria
 */
export class Filtering {
    field: string;
    mode: string;// like equal and entity
    value: any;// it can be an array of values ,being ors on the query

    constructor(field: string, mode: string, value: any) {
        this.field = field;
        this.mode = mode;
        this.value = value;
    }
}
