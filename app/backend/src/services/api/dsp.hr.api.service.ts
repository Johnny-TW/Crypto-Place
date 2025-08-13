import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { BaseApiService } from './base.api.service';

@Injectable()
export class DspHrApiService extends BaseApiService {
  constructor(@Inject(CACHE_MANAGER) protected cacheManager: Cache) {
    const code = __filename.split('/').pop().split('.').shift().toUpperCase();
    super(cacheManager, code);
  }

  async searchEmployee(query: any) {
    const params = {
      method: 'get',
      url: `${process.env.HR_URL}v2/EmplOrg/Wwhr/Employees`,
      header: {
        'Ocp-Apim-Subscription-Key': process.env.HR_TOKEN,
      },
      query,
      cache_key: `searchEmployee_${query.emplid}`,
      cache_expiration_time: 1,
    };
    return this.fetchApi(params);
  }
}
