import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import './styles.css';
import Navigation from '../../components/Navigation';
import Users from '../../components/Users';
import ActiveUsers from "../../components/ActiveUsers";
import Matches from "../../components/Matches";
import { addMatch } from "../../actions/matchActions";

const DashboardView = ({ history }) => {
    const socket = useSelector(({ socket }) => socket);
    const [users, setUsers] = useState([]);
    const [matches, setMatches] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        // Get the initial users list
        socket.emit('users');
        // Get the initial matches list
        socket.emit('matches');

        socket.on('matches', matches => setMatches(matches));

        socket.on('users', users => setUsers(users));
        /*socket.on('connected_user', user => {         // When I had socket.on('connected_user') like this
            if (!users.includes(user)) {                // I got a same key error for the users,
                setUsers(users => [...users, user])     // but this feels like the right way.
            }
        });*/
        socket.on('connected_user', user => socket.emit('users'));
        socket.on('disconnected_user', userID => socket.emit('users'));
        /*socket.on('disconnected_user', userID => {
            setUsers(users => users.filter(u => u.userID !== userID));
        });*/
        socket.on('user_left', userID => {
            setUsers(users => users.filter(u => u.userID !== userID));
        });

        socket.on('game_challenge', user => acceptOrDecline(user));
        socket.on('game_challenge_accepted', matchId => goToMatch(matchId));
        socket.on('new_match', match => dispatch(addMatch(match)));
        socket.on('game_challenge_declined', matchId => alert("Game declined."));

        return () => {
            socket.off('users');
            socket.off('connected_user');
            socket.off('disconnected_user');
            socket.off('user_left');
            socket.off('game_challenge');
            socket.off('game_challenge_accepted');
            socket.off('game_challenge_declined');
            socket.off('matches');
            socket.off('new_match');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matches]);      // When I had users in the deps array the whole website was extremely slow and crashed.

    const generateMatchId = () => {
        return uuidv4();
    };

    const acceptOrDecline = async (user) => {
        if (window.confirm(user.challenger.username + " wants to play with you. Would you like to accept?")) {
            let matchId = generateMatchId();
            await socket.emit('game_challenge_accepted', matchId, user.challenger.userID);
            setTimeout(function() {
                document.getElementById("waiting-div").style.display = "none";
                history.push({
                    pathname: "/match/" + matchId,
                    state: {
                        matchId: matchId,
                    }
                })
            }, 2000);
            document.getElementById("waiting-div").style.display = "block";
        } else {
            socket.emit('game_challenge_declined', user.challenger.userID);
        }
    };

    const goToMatch = (matchId) => {
        setTimeout(function() {
            document.getElementById("waiting-div-challenger").style.display = "none";
            history.push({
                pathname: "/match/" + matchId,
                state: {
                    matchId: matchId,
                }
            })
        }, 2000);
        document.getElementById("waiting-div-challenger").style.display = "block";
    };

    return (
        <div className="dashboard">
            <div id="waiting-div" style={{display: "none"}}>
                <div className="sending-to-match-room">
                    <p>Sending you to the match room...</p>
                </div>
            </div>
            <div id="waiting-div-challenger" style={{display: "none"}}>
                <div className="sending-to-match-room">
                    Game accepted. <p>Sending you to the match room...</p>
                </div>
            </div>
            <Navigation history={history}/>
            <Users users={users} />
            <ActiveUsers users={users} />
            <Matches matches={matches} />
        </div>
    );
};

export default DashboardView;
