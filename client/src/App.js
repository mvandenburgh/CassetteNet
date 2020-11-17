import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import PageFrame from './components/PageFrame';
import StartPage from './components/pages/StartPage';
import DashboardPage from './components/pages/DashboardPage';
import LoginPage from './components/pages/LoginPage';
import MyMixtapesPage from './components/pages/MyMixtapesPage';
import FavoritedMixtapesPage from './components/pages/FavoritedMixtapesPage';
import AtmospherePage from './components/pages/AtmospherePage';
import InboxPage from './components/pages/InboxPage';
import SignUpPage from './components/pages/SignUpPage';
import NotFoundPage from './components/pages/NotFoundPage';
import ViewMixtapePage from './components/pages/ViewMixtapePage';
import ViewUserPage from './components/pages/ViewUserPage';
import UserContext from './contexts/UserContext';
import CurrentSongContext from './contexts/CurrentSongContext';
import PlayingSongContext from './contexts/PlayingSongContext';
import JSTPSContext from './contexts/JSTPSContext';
import { jsTPS } from './utils/jsTPS'
import Directory from './components/Directory';
import ListeningRoomPage from './components/pages/ListeningRoomPage';
import ViewProfilePage from './components/pages/ViewProfilePage';
import ChangePasswordPage from './components/pages/ChangePasswordPage';
import FollowedUsersPage from './components/pages/FollowedUsersPage';
import AnonymousMixtapesPage from './components/pages/AnonymousMixtapesPage';
import MixtapeSearchResultsPage from './components/pages/MixtapeSearchResultsPage';
import AdminPage from './components/pages/AdminPage';
import VerifyAccountPage from './components/pages/VerifyAccountPage';
import VerifyLoginPage from './components/pages/VerifyLoginPage';
import OAuthUsernamePage from './components/pages/OAuthUsernamePage';
import ResetPasswordPage from './components/pages/ResetPasswordPage';

function App() {
  // check if user is logged in
  let userDefault = JSON.parse(localStorage.getItem('user'));
  if (!userDefault) {
    userDefault = {
      isGuest: true,
      isLoggedIn: false,
    };
  }
  // userDefault = JSON.parse('{"isLoggedIn":true,"isGuest":false,"_id":"5f862052790b506769c6a0dc","username":"demoUser","email":"catarina.pierre@example.com","verified":true,"favoritedMixtapes":["5f862052066d9931b3d49190","5f8620518e2aeed07faec255","5f86205097700519e84592ee","5f8620516371adde64b81f42"],"followedUsers":["5f86205255a51d454ea53a92","5f8620525ccdd0304e44d7c4","5f862052d32eca593941adb1","5f86205215fdecbb8ee063d5","5f8620525c406518ab703521","5f862052bee854d19fe6189d"],"admin":false,"unique_id":"0001"}');
  const [user, setUser] = useState(userDefault);
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [JSON.stringify(user)]);


  // check if song is playing
  let currentSongDefault = JSON.parse(localStorage.getItem('currentSong'));
  if (!currentSongDefault) {
    currentSongDefault = {};
  }
  const [currentSong, setCurrentSong] = useState(currentSongDefault);
  useEffect(() => {
    localStorage.setItem('currentSong', JSON.stringify(currentSong));
  }, [JSON.stringify(currentSong)]);


  const [playing, setPlaying] = useState(false);
  
  var my_tps = new jsTPS();
  const [tps, setTps] = useState(my_tps);

  return (
    <div className="App">
      <JSTPSContext.Provider value={{tps, setTps}}>
        <UserContext.Provider value={{user, setUser}}>
          <CurrentSongContext.Provider value={{currentSong, setCurrentSong}}>
            <PlayingSongContext.Provider value={{playing, setPlaying}}>
              <BrowserRouter>
                  <PageFrame invisible={!user.isLoggedIn} />
                    <div style={{ marginBottom: '105px', position: 'absolute', left: 8*9, height: 'calc(100vh - 8*9)', width: 'calc(100vw - 73px)'}}>
                      <Switch>
                        <Route exact path="/" component={user.isLoggedIn ? DashboardPage : StartPage} />
                        <Route exact path="/directory" component={Directory} /> {/* TODO: remove? */}
                        <Route exact path="/login" component={LoginPage} />
                        <Route exact path="/login/oauth" component={OAuthUsernamePage} />
                        <Route exact path="/login/success" component={VerifyLoginPage} />
                        <Route exact path="/resetPassword/:token" component={ResetPasswordPage} />
                        <Route exact path="/atmosphere" component={AtmospherePage} />
                        <Route exact path="/mixtape/:id" component={ViewMixtapePage} />
                        <Route exact path="/mymixtapes" component={MyMixtapesPage} />
                        <Route exact path="/favoritedmixtapes" component={FavoritedMixtapesPage} />
                        <Route exact path="/viewuser" component={ViewUserPage} />
                        <Route exact path="/followedusers" component={FollowedUsersPage}/>
                        <Route exact path="/anonymousmixtapes" component={AnonymousMixtapesPage}/>
                        <Route exact path="/inbox" component={InboxPage} />
                        <Route exact path="/NotFound" component={NotFoundPage}/>
                        <Route exact path="/SignUp" component={SignUpPage}/>
                        <Route exact path="/ChangePassword" component={ChangePasswordPage}/>
                        <Route exact path="/verify/:token" component={VerifyAccountPage} />
                        <Route exact path="/Admin">
                          {user.admin ? <AdminPage /> : <Redirect to="/" />}
                        </Route>
                        <Route exact path="/me" component={ViewProfilePage}/>
                        <Route exact path="/user/:id" component={ViewUserPage}/>
                        <Route exact path="/search/mixtapes" component={MixtapeSearchResultsPage}/>
                        <Route exact path="/listeningRoom/:id" component={ListeningRoomPage} /> {/* temporary route for listening room testing */}
                        <Route path="/*">
                          <Redirect to="/" />
                        </Route>
                      </Switch>
                    </div>
              </BrowserRouter>
            </PlayingSongContext.Provider>
          </CurrentSongContext.Provider>
        </UserContext.Provider>
      </JSTPSContext.Provider>
    </div>
  );
}

export default App;
