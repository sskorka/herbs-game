// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_KEY: 'AIzaSyBMEkW7zQd6dUCTv23jpmpxPcOWe4Zf6Eo',   // firebase public api key
  endpoints: {
    signin: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=',
    signup: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='
  },
  db: {
    default: 'https://herbs-game.firebaseio.com',
    names: 'https://herbs-game.firebaseio.com/names/',
    extraData: 'https://herbs-game.firebaseio.com/extradata/'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
