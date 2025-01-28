import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, lastValueFrom, map, of, pipe } from 'rxjs';
import { DirectPost } from './interfaces/direct-post.interface';

type DeepPartial<T> = { // todo OpenAPI's optional fields generated as required. find out how to fix it
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepPartial<T[P]>
    : T[P];
};

interface ChargeStatusExecuted {
  status: "executed"
}

interface ChargeStatusError {
  status: "error"
}

interface ChargeStatus3DSRequired {
  status: "3DS_required";
  Method: "POST" | "GET";
  PaReq: string;
  MD: string;
  URL: string;
  callback_url: string;
}

export type ChargeStatus = ChargeStatusExecuted | ChargeStatus3DSRequired | ChargeStatusError;

@Injectable()
export class LibernetixS2sConnectorService {

  private logger = new Logger('LibernetixS2s')

  constructor(
    private httpService: HttpService,
  ) {
  }

  async charge(url: string, clientData: DirectPost): Promise<ChargeStatus> {
    return lastValueFrom(this.httpService.post<ChargeStatus, DirectPost>(url, clientData).pipe(
      map((response) => {
        return response.data;
      }),
      catchError((err) => {
        this.logger.error(err);
        return of(err.response.data as ChargeStatus);
      }),
    ));
  }

}
