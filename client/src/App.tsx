import { useContext, useEffect, useState } from 'react';
import './App.css';
import { Context } from '.';
import { observer } from 'mobx-react-lite';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import LogoLoad from './components/LogoLoad/LogoLoad';

function App() {
  const {store} = useContext(Context)
  const [load, setLoad] = useState<boolean>(true) 

  useEffect(() => {
    siteLoad()
  }, [])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

async function siteLoad() {
  setLoad(true)
  setTimeout(() => {
    setLoad(false)
  }, 1000)
}

  return (
    // <div>
    //   <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : "АВТОРИЗУЙТЕСЬ" }</h1>
    //   <LoginForm/>
    // </div>
      <BrowserRouter>
        {load 
        ? <LogoLoad />
        : <AppRouter /> }
      </BrowserRouter>
      
  );
}

export default observer(App);
