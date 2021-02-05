// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url: 'https://api.spotify.com/v1',
  authUrl: 'https://accounts.spotify.com',
  clientId: 'd88a9f21ffdb403a99e1a5db7a93bed2',
  responseType: 'code',
  redirectUri: 'http://localhost:4200/',
  basicToken: 'ZDg4YTlmMjFmZmRiNDAzYTk5ZTFhNWRiN2E5M2JlZDI6MDJmOTRlZWFmZmYxNDVkY2EwNzJjZjlmZTUwYWU2ZTc=',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
