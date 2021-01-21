import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'mobx-react';
import { UserStore as userStore } from './stores/userStore';
import { SnackbarProvider } from 'notistack';

const UserStore = new userStore()
const stores = {UserStore}

ReactDOM.render(
  <Provider {...stores}>
    <SnackbarProvider maxSnack={3}>
      <App />
    </SnackbarProvider>
  </Provider>,
  document.getElementById('root')
);
