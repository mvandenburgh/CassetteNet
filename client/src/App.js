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
import AtmosphereSoundContext from './contexts/AtmosphereSoundContext';
import SocketIOContext from './contexts/SocketIOContext';
import { jsTPS } from './utils/jsTPS'
import { verifyUserLoggedIn, SERVER_ROOT_URL } from './utils/api';
import Directory from './components/Directory';
import ListeningRoomPage from './components/pages/ListeningRoomPage';
import ViewProfilePage from './components/pages/ViewProfilePage';
import ChangePasswordPage from './components/pages/ChangePasswordPage';
import FollowedUsersPage from './components/pages/FollowedUsersPage';
import AnonymousMixtapesPage from './components/pages/AnonymousMixtapesPage';
import MixtapeSearchResultsPage from './components/pages/MixtapeSearchResultsPage';
import UserSearchResultsPage from './components/pages/UserSearchResultsPage';
import AdminPage from './components/pages/AdminPage';
import VerifyAccountPage from './components/pages/VerifyAccountPage';
import VerifyLoginPage from './components/pages/VerifyLoginPage';
import OAuthUsernamePage from './components/pages/OAuthUsernamePage';
import ResetPasswordPage from './components/pages/ResetPasswordPage';
import socketIOClient from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(socketIOClient(SERVER_ROOT_URL));

  const [user, setUser] = useState(null);
  useEffect(() => {
    verifyUserLoggedIn()
      .then(user => {
        const newUser = { isLoggedIn: true, isGuest: false, ...user };
        setUser(newUser);
        socket.emit('setUserSocketId', { userId: newUser._id });
      })
      .catch(err => setUser({ isLoggedIn: false }));
  }, []);


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

  const [tps, setTps] = useState(new jsTPS());

  const [atmosphereSound, setAtmosphereSound] = useState({});

  useEffect(() => {
    socket.on('newInboxMessage', () => {
      verifyUserLoggedIn()
        .then(user => {
          console.log(user)
          const newUser = { isLoggedIn: true, isGuest: false, ...user };
          setUser(newUser);
        })
        .catch(err => setUser({ isLoggedIn: false }));
    });
  }, []);

  if (!user) {
    return null;
  }

  if (!user.isLoggedIn) {
    return (
      <div className="App">
        <UserContext.Provider value={{user, setUser}}>
          <BrowserRouter>
            <Route exact path="/" component={StartPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/login/oauth" component={OAuthUsernamePage} />
            <Route exact path="/login/success" component={VerifyLoginPage} />
            <Route exact path="/SignUp" component={SignUpPage}/>
            <Route exact path="/ChangePassword" component={ChangePasswordPage}/>
            <Route exact path="/verify/:token" component={VerifyAccountPage} />
            <Route path="/*">
              <Redirect to="/" />
            </Route>
          </BrowserRouter>
        </UserContext.Provider>
      </div>
    )
  }

  return (
    <div className="App">
      <SocketIOContext.Provider value={{socket, setSocket}}>
        <JSTPSContext.Provider value={{tps, setTps}}>
          <UserContext.Provider value={{user, setUser}}>
            <CurrentSongContext.Provider value={{currentSong, setCurrentSong}}>
              <PlayingSongContext.Provider value={{playing, setPlaying}}>
                <AtmosphereSoundContext.Provider value={{atmosphereSound, setAtmosphereSound}}>
                  <BrowserRouter>
                      <PageFrame invisible={!user?.isLoggedIn} />
                        <div style={{ marginBottom: '105px', position: 'absolute', left: 8*9, height: 'calc(100vh - 8*9)', width: '90%'}}>
                          <Switch>
                            <Route exact path="/" component={DashboardPage} />
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
                              {user?.admin ? <AdminPage /> : <Redirect to="/" />}
                            </Route>
                            <Route exact path="/me" component={ViewProfilePage}/>
                            <Route exact path="/user/:id" component={ViewUserPage}/>
                            <Route exact path="/search/mixtapes" component={MixtapeSearchResultsPage} />
                            <Route exact path="/search/users" component={UserSearchResultsPage} />
                            <Route exact path="/listeningRoom/:id" component={ListeningRoomPage} />
                            <Route path="/*">
                              <Redirect to="/" />
                            </Route>
                          </Switch>
                        </div>
                  </BrowserRouter>
                </AtmosphereSoundContext.Provider>
              </PlayingSongContext.Provider>
            </CurrentSongContext.Provider>
          </UserContext.Provider>
        </JSTPSContext.Provider>
      </SocketIOContext.Provider>
    </div>
  );
}

export default App;
