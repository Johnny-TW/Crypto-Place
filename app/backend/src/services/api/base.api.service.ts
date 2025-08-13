import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class BaseApiService {
  constructor(
    @Inject(CACHE_MANAGER) protected cacheManager: Cache,
    protected systemCode: string,
  ) {}

  fetchApi = async ({
    url = '',
    method = 'get',
    header = {},
    query = {},
    body = {},
    cache_key = null,
    cache_expiration_time = 5, //minutes
    full_response = false,
    responseType = null,
    error_code: default_error_code = null,
    error_backup_key = null,
    error_message: default_error_message = null,
  }) => {
    let success = true;
    let error_code = null;
    let error_message = null;

    const cache_data = cache_key
      ? await this.cacheManager.get(cache_key)
      : null;
    if (cache_data) {
      return cache_data;
    }

    const options = {
      method: method,
      url: url,
      headers: header,
      params: query,
      data: body,
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
    };

    if (body instanceof FormData) {
      options['headers']['Content-Type'] = 'multipart/form-data';
      // options['data'] = this.convertFormdata(body);
    }
    if (responseType) options['responseType'] = responseType;

    // 用axios呼叫api 如果回來有報錯就丟出錯誤
    const response: any = await axios(options).catch((error) => {
      success = false;
      console.log(error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        let message = '';
        if (error.response.data.message) message = error.response.data.message;
        else if (error.response.data.error) message = error.response.data.error;
        else if (error.response.data.detail)
          message = error.response.data.detail;
        else message = JSON.stringify(error.response.data);

        error_message = message;
        error_code = default_error_code ?? error.response.status;
        // throw new HttpException(
        //   `[${this.systemCode}] Api Error Please Contact Developers - ${message}`,
        //   error.response.status,
        // );
      } else {
        error_message = error.message;
        // Something happened in setting up the request that triggered an Error
        // throw new Error(error.message);
      }
    });

    if (!success) {
      if (error_backup_key) {
        const error_backup_data = await this.cacheManager.get(error_backup_key);
        if (error_backup_data) return error_backup_data;
      }
      throw new HttpException(
        default_error_message ??
          `[${this.systemCode}] Api Error Please Contact Developers - ${error_message}`,
        error_code ?? 500,
      );
    }

    if (cache_key && success) {
      this.cacheManager.set(
        cache_key,
        response.data,
        cache_expiration_time * 60 * 1000,
      );
    }
    if (error_backup_key && success) {
      this.cacheManager.set(
        error_backup_key,
        response.data,
        // 14 days
        14 * 24 * 60 * 60 * 1000,
      );
    }
    if (full_response) return response;
    return response.data;
  };

  convertFormdata = (variables: object) => {
    const data = new FormData();
    for (const key in variables) {
      const value = variables[key];
      // 如果value是readstream
      if (Array.isArray(value)) {
        for (let i = 0; i < value?.length; i++) {
          data.append(key + '[' + i + ']', value[i] ?? '');
        }
      } else data.append(key, value ?? '');
    }
    return data;
  };
}
