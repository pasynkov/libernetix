import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, lastValueFrom, map, pipe } from 'rxjs';
import { DirectPost } from './interfaces/direct-post.interface';

type DeepPartial<T> = { // todo OpenAPI's optional fields generated as required. find out how to fix it
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepPartial<T[P]>
    : T[P];
};



@Injectable()
export class LibernetixS2sConnectorService {

  constructor(
    private httpService: HttpService,
  ) {
  }

  async charge(url: string, clientData: DirectPost): Promise<any> {
    return lastValueFrom(this.httpService.post<any, DirectPost>(url, clientData).pipe(
      catchError((err) => {
        console.log(err.response);
        throw err;
      }),
      map((response) => {
        console.log(response)
        return response.data;
      }),
    ));
  }

}
