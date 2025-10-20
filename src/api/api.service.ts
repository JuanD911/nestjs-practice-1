import { Injectable, HttpException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ApiService {
  private readonly axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: 'https://www.swapi.tech/api',
      timeout: 10000,
    });
  }

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url);
      return data;
    } catch (error) {
      throw new HttpException(
        `Error fetching data from API: ${error.message}`,
        error.response?.status || 500,
      );
    }
  }
}
