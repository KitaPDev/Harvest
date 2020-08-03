import { HttpHeaders } from "@angular/common/http";

export const httpPostOptions: { headers; observe; withCredentials; } = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  withCredentials: true,
  observe: 'response'
};


export const httpGetOptions: { observe; withCredentials; } = {
  withCredentials: true,
  observe: 'response'
};
