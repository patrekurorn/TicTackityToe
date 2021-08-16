import React, { useEffect } from "react";
import './styles.css';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {addSession, removeSession} from "../../actions/sessionActions";

const Navigation = ({ history }) => {
    const session = useSelector(({ session }) => session);
    const socket = useSelector(({ socket }) => socket);
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('session', session => {
            dispatch(addSession(session));
            history.push('/dashboard');
        });

        return () => {
            socket.off('session');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    const leave = () => {
        if (window.confirm("Are you sure you want to leave?")) {
            dispatch(removeSession(session));
            socket.emit('leave');
            localStorage.removeItem("s.id");
            setTimeout(function () {
                socket.disconnect();
                setTimeout(function () {
                    history.push("/");
                }, 100)
            }, 100);
            history.push("/");
        }
    };

    return (
        <nav className="navigation">
            <NavLink
                exact
                to="/"
                className="nav-link nav-home">Home</NavLink>
            <NavLink
                exact
                to="/dashboard"
                className="nav-link nav-dashboard">Dashboard</NavLink>
            <div className="login">
                {
                    socket.connected === true
                    ?
                        <div style={{ display: "flex"}}>
                            <button className="leave-button" onClick={() => leave()}>Leave</button>
                            <div>Logged in as: <span className="username">{ session.username }</span></div>
                        </div>
                    :
                        <div style={{ display: "flex"}}>
                            <button className="leave-button" onClick={() => leave()}>Leave</button>
                            <div>Not logged in</div>
                        </div>
                }
            </div>
        </nav>
    );
};

export default Navigation;
