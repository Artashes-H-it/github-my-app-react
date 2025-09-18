import React, { useRef, useEffect, useState } from 'react';
import styles from './Chat.module.scss';
import chat from '../../assets/icons/chat.png';
import close from '../../assets/icons/close.png';
import send from '../../assets/icons/send.png';
import stickers from '../../assets/icons/stickers.png';
import add from '../../assets/icons/add.png'
import del from '../../assets/icons/del.png';
import api from '../../api/axios';
import { Input, Label } from '../ui';
import getEchoInstance from '../../services/websoket/echo';
import { emojies } from '../../assets/emojies/emjies';
import UsersComponent from './UsersComponent';
import MessagesComponent from './MessageComponent';


const Chat = () => {
    const [users, setUsers] = useState(null);
    const [showChatContent, setShowChatContent] = useState(false);
    const [choosedUserName, setChoosedUserName] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [choosedUser, setChoosedUser] = useState(null);
    const [sendMessageBtn, setSendMessageBtn] = useState(false);
    const [messages, setMessages] = useState([]);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [unreadMessages, setUnreadMessages] = useState([]);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        body: '',
        receiver_id: '',
        file: null
    });
    const [errors, setErrors] = useState({});
    const [emojis, setEmoji] = useState(emojies);
    const [showEmojis, setShowEmoji] = useState(false);
    const [isOnline, setIsOnline] = useState(null);
    const [isEnter, setIsEnter] = useState(null);
    const [isLeave, setIsLeave] = useState(null);


    const componentRef = useRef();
    const scrollRef = useRef(null);

    const showHideContentChat = () => {
        setShowChatContent(!showChatContent)
    }

    const handleClickOutside = (event) => {
        if (componentRef && componentRef.current && !componentRef.current.contains(event.target)) {
            setShowChatContent(false);
        }
    };

    useEffect(() => {

        handleClickOutside(event)
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, []);

    useEffect(() => {
        checkUserMessages();
        getUnreadMessages();
    }, [])

    const checkUserMessages = () => {

        const userId = localStorage.getItem("userId");
        setCurrentUser(userId);

        let echo = getEchoInstance();
        if (echo && userId) {
            const channel = `userMessages.${userId}`;
            console.log("Subscribing to:", channel, userId);

            echo.private(channel)
                .listen('.message.sent', (e) => {
                    const currentUserId = Number(userId);
                    const filteredUreadMessage = e.unread.filter((item) => Number(item.receiver_id) == currentUserId);
                    const initialCount = 0;
                    const ureadCount = filteredUreadMessage.reduce((accumulator, currentValue) => accumulator + currentValue.messages_count, initialCount)

                    setUnreadMessages(e.unread);
                    setUnreadMessagesCount(ureadCount);
                    scrollToBottom();
                });

            return () => {
                echo.leave(channel);
            };
        }
    };


    useEffect(() => {

        setCurrentUser(localStorage.getItem("userId"));
        let echo = getEchoInstance();

        if (!currentUser || !choosedUser) return;

        const ids = [currentUser, choosedUser].sort();
        const channel = `chat.${ids[0]}.${ids[1]}`;

        echo.private(channel)
            .listen('.message.sent', (e) => {
                //console.log("Event received:", e);
                setMessages((prev) => [...prev, e.message]);
                scrollToBottom();
            });

        return () => {
            echo.leave(channel);
        };

    }, [choosedUser])

    const handleChage = (e) => {
        const target = e.target
        const { name, value, type } = target;

        if (type == 'file') {
            const file = target.files[0];
            if (!file) return;

            setFileName(file.name);
            setFormData((prev) => ({
                ...prev,
                [name]: file,
            }));
        }
        else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        validateField(name, value);
    }

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "body":
                if (!value) error = "massage is required";
                break;
        }

        setErrors((prev) => ({ ...prev, [name]: error }));
    }

    const chooseUser = (item) => {
        setMessages([])
        formData.receiver_id = item.id;
        setChoosedUser(item.id)
        setChoosedUserName(item.name);
        getMessages(item.id);
        getUnreadMessages();
    }

    const delAttached = () => {
        setFile(null);
        setFileName('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {

            if (!formData[key]) {
                return;
            }

            formDataToSend.append(key, formData[key]);
        });


        try {
            setSendMessageBtn(true);
            await api.post("/send-message", formDataToSend)
                .then((res) => {
                    if (res.status == 200) {
                        // console.log(res, 'sdsd')
                        setSendMessageBtn(false);
                        setFileName('');
                        setFormData({ ...formData, body: '' });
                        scrollToBottom();
                    }
                });
        } catch (err) {
            setErrors("Message didn't send");
            if (err.response && err.response.status === 422) {
                console.log(err, 'err')
                setErrors(err.response.data.errors);
            } else {
                console.error("Unexpected error:", err);
            }
        } finally {
            setLoading(false);
            setSendMessageBtn(false);
        }
    }

    const getMessages = async (receiverId) => {

        setLoading(true);

        try {
            await api.get(`/messages/${receiverId}`)
                .then((res) => {
                    if (res.status == 200) {
                        setMessages(res.data.data);
                        // console.log(res.data.data, 'sdsd')
                        scrollToBottom();
                    }
                });
        } catch (err) {
            setErrors("Message didn't get");
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                console.error("Unexpected error:", err);
            }
        } finally {
            setLoading(false);
        }
    }

    const getUnreadMessages = async () => {

        try {
            await api.get(`/messages/unread`)
                .then((res) => {
                    if (res.status == 200) {
                        setUnreadMessages(res.data.data);
                        const initialCount = 0;
                        const ureadCountity = res.data.data.reduce((accumulator, currentValue) => accumulator + currentValue.messages_count, initialCount)
                        setUnreadMessagesCount(ureadCountity);
                    }
                });
        } catch (err) {
            setErrors("Messages didn't get");
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                console.error("Unexpected error:", err);
            }
        } finally {
        }
    }

    const deleteMess = async (messageId) => {
        try {
            await api.post(`/messages/delete`, { id: messageId })
                .then((res) => {
                    if (res.status == 200) {
                        getMessages(choosedUser);
                    }
                });
        } catch (err) {
            setErrors("Message didn't deleted");
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                console.error("Unexpected error:", err);
            }
        }
    }

    const scrollToBottom = () => {
        scrollRef?.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });


    }

    const showEmojies = (showEmojis) => {
        showEmojis = !showEmojis;
        setShowEmoji(showEmojis);
    }

    const settingEmoji = (item) => {
        if (choosedUserName) {
            setFormData(prev => ({ ...prev, body: prev.body + item }));
        }
    }

    if (unreadMessages) {
        unreadMessages.filter((item) => item.receiver_id != currentUser)
    }

    return (
        <div className={styles.chatWrap}>
            {!showChatContent &&
                <div onClick={() => showHideContentChat()} className={styles.chat}>
                    <img src={chat}></img>
                    {(unreadMessagesCount > 0) &&
                        <div>{unreadMessagesCount}</div>
                    }
                </div>
            }
            {showChatContent &&
                <div ref={componentRef} className={styles.chatContent}>
                    <div className={styles.chatContentHeader}><img src={close} onClick={() => showHideContentChat()}></img></div>
                    <div className={styles.chatContentMain}>
                        <div className={styles.chatContentWrap}>
                            <UsersComponent chooseUser={chooseUser} unreadMessages={unreadMessages} />
                            <div className={styles.chatContentChat}>
                                <div>
                                    <p className={styles.userName}>{choosedUserName}</p>
                                </div>
                                <div className={styles.chatContentMessage}>
                                    <div ref={scrollRef}>
                                        {messages && messages.length > 0 ? (
                                            messages.map((item, index) => (
                                                <React.Fragment key={index}>
                                                    <MessagesComponent
                                                        messages={messages}
                                                        currentUser={currentUser}
                                                        item={item}
                                                        index={index}
                                                        deleteMess={deleteMess} />
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            !loading && <span>No messages</span>
                                        )}
                                        {loading && <span>Loading ...</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.chatContentInputWrap}>
                                <Input id="massage"
                                    type="text"
                                    name={'body'}
                                    onChange={handleChage}
                                    placeholder={'massage'}
                                    value={formData.body}
                                    disabled={choosedUserName ? false : true}
                                />
                                <div>
                                    <img src={stickers} onClick={() => showEmojies(showEmojis)}></img>
                                </div>
                                <div className={styles.chatContentFile}>
                                    <Label htmlFor="file">
                                        <img src={add} alt="add" />
                                    </Label>
                                    <Input
                                        id="file"
                                        type="file"
                                        name={'file'}
                                        onChange={handleChage}
                                        disabled={choosedUserName ? false : true}
                                    />
                                </div>
                                <button type='sublit' disabled={sendMessageBtn}>
                                    <img src={send}></img>
                                </button>
                                {errors.body && <p className={styles.textDanger}>{errors.body[0]}</p>}
                            </div>
                        </form>
                        {fileName &&
                            <div className={styles.chatContentAttachedFileWrap}>
                                <div>
                                    {fileName}
                                </div>
                                <img onClick={delAttached} src={del} alt="delete" />
                                {errors.file && <p className={styles.textDanger}>{errors.file[0]}</p>}
                            </div>
                        }
                        {showEmojis &&
                            <div className={styles.chatContentEmojiWrap}>
                                {emojis.map((item, index) => (
                                    <span key={index} onClick={() => { settingEmoji(item) }}>{item}</span>
                                ))
                                }
                            </div>}
                    </div>

                </div>
            }
        </div>
    )
}

export default Chat;