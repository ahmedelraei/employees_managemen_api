import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogsService } from '../../modules/logs/logs.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logsService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';

    const now = Date.now();

    return next.handle().pipe(
      tap(async (response) => {
        const duration = Date.now() - now;

        // Only log CRUD operations on employees and departments
        if (this.shouldLog(method, url)) {
          try {
            const logData = this.extractLogData(
              method,
              url,
              body,
              response,
              ip,
              userAgent,
            );
            if (logData) {
              await this.logsService.createLog(logData);
            }
          } catch (error) {
            // Don't throw errors for logging failures
            console.error('Logging error:', error);
          }
        }

        console.log(`${method} ${url} - ${duration}ms`);
      }),
    );
  }

  private shouldLog(method: string, url: string): boolean {
    const crudMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    const entityRoutes = ['/employees', '/departments'];

    return (
      crudMethods.includes(method) &&
      entityRoutes.some((route) => url.includes(route))
    );
  }

  private extractLogData(
    method: string,
    url: string,
    body: any,
    response: any,
    ip: string,
    userAgent: string,
  ): any {
    const entity = url.includes('/employees') ? 'employee' : 'department';
    let action: string;
    let entityId: number | null = null;
    let newValues: any;
    let oldValues: any;

    switch (method) {
      case 'POST':
        action = 'CREATE';
        entityId = response?.data?.id || null;
        newValues = body;
        break;
      case 'PUT':
      case 'PATCH':
        action = 'UPDATE';
        entityId = this.extractIdFromUrl(url);
        newValues = body;
        // Note: In a real implementation, you'd want to fetch old values before update
        break;
      case 'DELETE':
        action = 'DELETE';
        entityId = this.extractIdFromUrl(url);
        break;
      default:
        return null;
    }

    if (!entityId || entityId === null) return null;

    return {
      action,
      entity,
      entity_id: entityId,
      old_values: oldValues,
      new_values: newValues,
      ip_address: ip,
      user_agent: userAgent,
    };
  }

  private extractIdFromUrl(url: string): number | null {
    const matches = url.match(/\/(\d+)(?:\?|$)/);
    return matches ? parseInt(matches[1], 10) : null;
  }
}
