import React from "react";
import './styles.css';
import { useSelector } from 'react-redux';

const ActiveUser = ({ user }) => {
    const session = useSelector(({ session }) => session);
    const socket = useSelector(({ socket }) => socket);

    const sendGameChallenge = () => {
        socket.emit('game_challenge', user.userID);
    };

    return (
        <div className='user-container'>
            <p>User: </p>
            {
                user.userID === session.userID
                ?
                    <div className="user">{user.username} (you)</div>
                :
                    <div className="user">{user.username}</div>
            }
            <div className="connected-div">
                <div>
                    <p className="connected">Connected</p>
                </div>
                {
                    user.userID !== session.userID
                    ?
                        <button
                            className="play-game-button"
                            onClick={() => sendGameChallenge()}>Send Challenge</button>
                    :
                        <></>
                }
            </div>
        </div>
    );
};

export default ActiveUser;
