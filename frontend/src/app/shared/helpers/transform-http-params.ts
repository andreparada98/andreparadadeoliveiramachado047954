import { HttpParams } from '@angular/common/http';

export function toHttpParams(obj: any): HttpParams {
    let params = new HttpParams();
    for (const key of Object.keys(obj)) {
        if (obj[key] !== null && obj[key] !== undefined) {
            if (obj[key] instanceof Date) {
                params = params.append(key, obj[key].toISOString());
            } else {
                params = params.append(key, obj[key].toString());
            }
        }
    }
    return params;
}
