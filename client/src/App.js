import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PageFrame from './components/PageFrame';
import StartPage from './components/pages/StartPage';
import DashboardPage from './components/pages/DashboardPage';
import LoginPage from './components/pages/LoginPage';
import MyMixtapesPage from './components/pages/MyMixtapesPage';
import AtmospherePage from './components/pages/AtmospherePage';
import InboxPage from './components/pages/InboxPage';
import NotFoundPage from './components/pages/NotFoundPage';
import UserContext from './contexts/UserContext';


function App() {
  const [user, setUser] = useState({
    username: null,
    isGuest: true,
    isLoggedIn: true,
  });

  return (
    <div className="App">
      <UserContext.Provider value={{user, setUser}}>
        <BrowserRouter>
            <PageFrame invisible={!user.isLoggedIn} />
              <div style={{ position: 'absolute', left: 8*9, height: 'calc(100vh - 8*9)', width: 'calc(100vw - 73px)'}}>
                <Switch>
                  <Route exact path="/" component={user.isGuest ? StartPage : DashboardPage} /> {/* TODO: should redirect to dashboard when logged in */}
                  <Route exact path="/login" component={LoginPage} />
                  <Route exact path="/atmosphere" component={AtmospherePage} />
                  <Route exact path="/mymixtapes" component={MyMixtapesPage} />
                  <Route exact path="/inbox" component={InboxPage} />
                  <Route exact path="/NotFound" component={NotFoundPage}/>
                </Switch>
              </div>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
