import React, {useEffect, useState} from "react";
import {
    AgoraRTCProvider,
    useRTCClient,
    useClientEvent,
    useLocalCameraTrack,
    useLocalMicrophoneTrack,
    useJoin,
    RemoteUser,
    LocalVideoTrack,
    LocalAudioTrack
} from "agora-rtc-react";
import VideoCall from "./VideoCall.jsx";
import api from "../api/axios.js";
import AgoraRTC from "agora-rtc-sdk-ng";

const VideoMeeting = () => {
    const [channel, setChannel] = useState('');
    const [userToken, setUserToken] = useState('');
    const [showJoin, setShowJoin] = useState(false);

    const {localCameraTrack, error: cameraError} = useLocalCameraTrack();
    const {localMicrophoneTrack, error: micError} = useLocalMicrophoneTrack();

    const client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"});

    const handleJoin = async (channelName) => {
        // 1. Запрос токена к Laravel бэкенду
        // const response = await api.post('/agora/token', {channelName: channelName});
        // const data = await response.data;
        // console.log(data);
        // // 2. Установка данных и рендеринг компонента звонка
        // setUserToken(data.token);
        // setUserUid(data.uid);
        // setChannel(channelName);
        setShowJoin(true);
    };

    if (showJoin) {
        return (
            (cameraError && cameraError.name === 'NotAllowedError') ?
                <div style={{color: 'red'}}>
                    🚨 ОШИБКА: Доступ к камере заблокирован! Пожалуйста, разрешите доступ в настройках браузера.
                </div>
                :
                <AgoraRTCProvider client={client}>
                    <VideoCall/>
                </AgoraRTCProvider>
        );
    }

    return <button onClick={() => handleJoin()}>Создать/Присоединиться к встрече</button>;
};

export default VideoMeeting;
