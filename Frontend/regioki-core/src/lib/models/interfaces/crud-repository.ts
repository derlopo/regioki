import { Observable } from 'rxjs';
import { Payload } from './payload';

export interface CrudRepository<T, ID> {
  create?(t: T): Observable<Payload<T>>;
  update?(id: ID, t: T): Observable<Payload<T>>;
  findOne?(id?: ID): Observable<Payload<T>>;
  findAll?(): Observable<Payload<T[]>>;
  findByQuery?(query: string): Observable<Payload<T[]>>;
  delete?(id?: ID): Observable<any>;
  upsert?(t: T): Observable<Payload<T>>;
}
