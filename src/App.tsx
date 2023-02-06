import React from 'react';
import './css/App.css'
import { useState, useContext } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";
import { Main } from './components/Main';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WorkoutDetail } from './components/workout/WorkoutDetail';

import { UserContext } from './db/UserContext';

export type User = {
  id?: string,
  name: string, 
  email: string,
  photoUrl: string,
};

function App() {

  const [user, setUser] = useState({
    name: "",
    email: "",
    photoUrl: ""
  })

  return (
    <UserContext.Provider value={{user, setUser}}>
      

      <Router>
        <Routes>
          <Route path="/" element={<Main/>} />
          <Route path="/workout/:id" element={<WorkoutDetail/>} />
        </Routes>
      </Router>

    </UserContext.Provider>
    
  );
}

export default App;
