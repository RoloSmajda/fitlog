import {createContext } from 'react';
import { User } from '../App';

interface UserContextProps {
    user: User,
    setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const UserContext = createContext<UserContextProps>({
    user: {
        name:  "",
        email: "",
        photoUrl: "",
    },
    setUser: () => {}

});

