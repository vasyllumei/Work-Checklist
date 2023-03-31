import axios from 'axios';
import cookie from 'js-cookie';
const refreshTokenUrl = 'Account/refresh-token';

export type ResponseType<Data> = {
  data: Data;
  message?: string;
};

const AuthorizationToken = typeof cookie.get('token') === 'string' ? `Bearer ${cookie.get('token')}` : null;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json-patch+json',
    'Access-Control-Allow-Origin': '*',
    Authorization: AuthorizationToken,
  },
  responseType: 'json',
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const setToken = (originalRequest: any, token: unknown) => {
  api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  api.defaults.headers['Authorization'] = 'Bearer ' + token;
  originalRequest.headers['Authorization'] = 'Bearer ' + token;
};

api.interceptors.response.use(
  response => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== refreshTokenUrl) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            setToken(originalRequest, token);

            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const localStorageToken = cookie.get('token');
      const localStorageRefreshToken = JSON.parse(localStorage.getItem('refreshToken') || '');

      if (!localStorageToken) return Promise.reject(error);

      return api
        .post(refreshTokenUrl, {
          token: localStorageToken,
          refreshToken: localStorageRefreshToken,
        })
        .then(async answer => {
          const token = answer.data.item?.token;
          const refreshToken = answer.data.item?.refreshToken;

          if (token) {
            if (answer?.data.success) {
              await localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
              cookie.set('token', token);

              setToken(originalRequest, token);

              processQueue(null, token);

              return api(originalRequest);
            }
          }
        })
        .catch(err => {
          processQueue(err, null);

          return err;
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    return Promise.reject(error);
  },
);
