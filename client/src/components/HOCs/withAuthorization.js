import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSession } from "../../actions/sessionActions";

const WithAuthorization = (WrappedComponent) => {
    const socket = useSelector(({ socket }) => socket);
    const dispatch = useDispatch();

    return class extends React.Component {
        state = {
            isHidden: true
        };

        componentDidMount() {
            socket.on('session', session => {
                dispatch(addSession(session));
            });

            let sessionID = localStorage.getItem("s.id");

            if (!sessionID) {
                this.props.history.push('/');
            } else {
                this.setState({ isHidden: false });
                socket.auth = { sessionID: sessionID };
                socket.connect();
            }
        }

        render() {
            const { isHidden } = this.state;
            return isHidden ? <></> : <WrappedComponent {...this.props} />;
        }
    }
};

export default WithAuthorization;
