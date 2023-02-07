import {createContext } from 'react';
import { User } from '../App';

interface UserContextProps {
    user: User,
    setUser: React.Dispatch<React.SetStateAction<User>>;
}

const name = localStorage.getItem("user_name")
const email = localStorage.getItem("user_email");
const photoUrl = localStorage.getItem("user_photo_url");

export const UserContext = createContext<UserContextProps>({
    user: {
        name:  name === null ? "" : name,
        email: email === null ? "" : email,
        photoUrl: photoUrl === null ? "" : photoUrl,
    },
    setUser: () => {}

});

