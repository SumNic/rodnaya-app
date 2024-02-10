import { useContext, useEffect } from 'react';
import './App.css';
import { Context } from '.';
import { observer } from 'mobx-react-lite';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import LogoLoad from './components/LogoLoad/LogoLoad';

function App() {
  const {store} = useContext(Context)

  useEffect(() => {
    if (localStorage.getItem('token') && localStorage.getItem('device')) {
      store.checkAuth()
    } else {
      store.setLoad(false)
    }
  }, [])

  return (
      <BrowserRouter>
        {store.load 
        ? <LogoLoad />
        : <AppRouter /> }
      </BrowserRouter>      
  );
}

export default observer(App);
