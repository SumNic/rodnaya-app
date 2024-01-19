import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  async catch(exception: RpcException, host: ArgumentsHost): Promise<any> {
    console.log(exception.getError(), 'exception.getError()')
    return  exception.getError();
    // const error: any = exception.getError();
    // const ctx = host.switchToHttp();
    // const response = ctx.getResponse<Response>();
    // return console.log(error);
    //  .status(error?.statusCode).json(error);

    // response.status(error?.statusCode).json(error); 
  }
}
