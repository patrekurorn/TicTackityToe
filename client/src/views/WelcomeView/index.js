import React from "react";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSession } from "../../actions/sessionActions";
import './styles.css';
import Button from '../../components/Button';
import Navigation from "../../components/Navigation";

const WelcomeView = ({ history }) => {
    const socket = useSelector(({ socket }) => socket);
    const session = useSelector(({ session }) => session);
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');

    useEffect(() => {
        socket.on('session', session => {
            dispatch(addSession(session));
            history.push('/dashboard');
        });

        return () => {
            socket.off('session');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChooseUsername = username => {
        if (validateUsername(username) === true) {
            socket.on('connect_error', e => alert(e));
            socket.auth = { username: username };
            socket.connect();
        }
    };

    const validateUsername = username => {
        if (username.length > 14) {
            alert("Username must be 14 letters or shorter.");
            return false
        }
        return true
    };

    return (
        <div className="welcome-view-container container">
            <Navigation history={history}/>
            <div className="welcome-title-div">
                <h1>Welcome to Tic Tackity Toe!</h1>
            </div>
            {
                socket.connected === true
                ?
                    <div className="logged-in-container">
                        <h1 className="logged-in-text">You are logged in as: <p>{session.username}</p></h1>
                    </div>
                :
                    <div className="input-container">
                        <label htmlFor="username">Choose your username</label>
                        <input
                            autoFocus
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Enter your username..."
                            value={username}
                            onChange={e => setUsername(e.target.value)} />
                        <Button onClick={() => onChooseUsername(username) } style={{ float: 'left', marginTop: 10 }}>Select</Button>
                    </div>
            }
        </div>
    )
};

export default WelcomeView;
