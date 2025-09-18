import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import styles from './Chat.module.scss';
import userIcon from '../../assets/icons/userIcon.png';
import getEchoInstance from '../../services/websoket/echo';

const UsersComponent = ({ chooseUser, unreadMessages }) => {
    const [users, setUsers] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isOnline, setIsOnline] = useState(null);
    const [isEnter, setIsEnter] = useState(null);
    const [isLeave, setIsLeave] = useState(null);

    useEffect(() => {
        setCurrentUser(localStorage.getItem("userId"));
        getUsers();
    }, [])

    useEffect(() => {
        checkUsersStatus();
    }, [currentUser]);

    const checkUsersStatus = () => {

        let echo = getEchoInstance();

        if (echo) {
            // echo.join('presence.users')
            //     .here((users) => { setIsOnline(users); console.log('Пользователи онлайн:', users) })
            //     .joining((user) => { setIsEnter(user); console.log('Зашёл:', user) })
            //     .leaving((user) => { setIsLeave(user); console.log('Вышел:', user) });

            echo.join("presence.users")
                .here((users) => {
                    //console.log(users, 'sdtyty')
                    setIsOnline(users);
                })
                .joining((user) => {
                    setIsOnline((prev) => [...prev, user]);
                })
                .leaving((user) => {
                    setIsOnline((prev) => prev.filter((u) => u.id !== user.id));
                });

            return () => {
                echo.leave('presence.users');
            };
        }
    }

    const getUsers = async () => {
        try {
            const response = await api.get("/users").then();
            setUsers(response.data.data);
        } catch (err) {
            setErrors("Error on time get user");
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    const findUserMes = (id) => {
        const found = unreadMessages.find((elem) => elem.sender_id == id);
        return  found && found.messages_count ? found.messages_count : '';
    }

    const onlineIds = useMemo(
        () => isOnline && isOnline.length > 0 ? new Set(isOnline.map((u) => u.id)) : '',
        [isOnline]
    );

    return (
        <div className={styles.chatContentUsers}>
            {users && users.length > 0 ? (
                users.map((item, index) => (
                    currentUser != item.id &&
                    <div className={styles.chatListUsers} key={index}>
                        <img src={userIcon} alt="User icon" />
                        <p onClick={() => chooseUser(item)} key={index}>{item.email}</p>
                        {onlineIds && onlineIds.has(item.id) && (
                            <div className={styles.chatOnlineUsers}></div>
                        )}
                        {(unreadMessages && unreadMessages.length > 0) && findUserMes(item.id) > 0 && (
                            <div className={styles.chatUsersMessages}>{findUserMes(item.id)}</div>
                        )}
                    </div>
                ))
            ) : (
                <p>No users</p>
            )}
        </div>
    )
}

export default UsersComponent;