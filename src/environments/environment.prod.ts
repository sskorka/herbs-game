export const environment = {
  production: true,
  appName: 'Herbs Up!',
  defaultLanguage: 'en',
  devMail: 'szymonskorka@outlook.com',
  firebase: { // replace these with your own before building/serving
    apiKey: 'AIzaSyBMEkW7zQd6dUCTv23jpmpxPcOWe4Zf6Eo',
    endpoints: {
      signin: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=',
      signup: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='
    },
    db: {
      default: 'https://herbs-game.firebaseio.com',
      names: 'https://herbs-game.firebaseio.com/names/',
      extraData: 'https://herbs-game.firebaseio.com/extradata/'
    }
  }
};
