import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CrudRepository } from '../models/interfaces/crud-repository';
import { Payload } from '../models/interfaces/payload';
import { CommonClass } from '../classes/common';

export abstract class CrudService<T, ID> implements CrudRepository<T, ID> {
  public commonclass: CommonClass;
  constructor(protected _http: HttpClient, protected _base: string) {
    this.commonclass = new CommonClass();
  }

  /**
   * Creates an entry and returns its value.
   */

  create(t: T): Observable<Payload<T>> {
    return this._http.post<Payload<T>>(this._base, { data: t });
  }

  update(id: ID, t: T): Observable<Payload<T>> {
    return this._http.put<Payload<T>>(this._base + '/' + id, { data: t });
  }

  /**
   * Returns an entry by id
   */

  findOne(id: ID, populate = ''): Observable<Payload<T>> {
    return this._http.get<Payload<T>>(this._base + '/' + id + `${populate}`);
  }

  /**
   * Returns all entries.
   */

  findAll(populate = ''): Observable<Payload<T[]>> {
    return this._http.get<Payload<T[]>>(this._base + `&${populate}`);
  }
  /**
   * Returns data With Pagination entries.
   */

  findAllWithPagination(
    limit = 5,
    page = 1,
    populate = ''
  ): Observable<Payload<T[]>> {
    const paginationParams = `pagination[pageSize]=${limit}&pagination[page]=${page}`;

    return this._http.get<Payload<T[]>>(
      this._base + `?${paginationParams}${populate}`
    );
  }

  /**
   * Returns entries matching the query filters
   */

  findByQuery(query: string, populate = ''): Observable<Payload<T[]>> {
    return this._http.get<Payload<T[]>>(this._base + `?${query}${populate}`);
  }

  /**
   * Deletes an entry by id and returns its value.
   */

  delete(id: ID): Observable<T> {
    return this._http.delete<T>(this._base + '/' + id);
  }
}
