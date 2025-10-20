import axios from 'axios';

export interface HttpAdapter {
    get<T>(url:string): Promise<T>;
}

export class ApiAdapter implements HttpAdapter {
    private readonly axios = axios;

    async get<T>(url:string): Promise<T> {
        const data = await this.axios.get<T>(url);
        return data.data;
    }
}