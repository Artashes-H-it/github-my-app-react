import React, { useState } from 'react';
import {
    useIsConnected,
    useJoin,
    usePublish,
    useLocalMicrophoneTrack,
    useLocalCameraTrack,
    useRemoteUsers,
    LocalUser,
    RemoteUser
} from "agora-rtc-react";
import api from "../api/axios.js";

// Этот компонент должен быть обернут в <AgoraRTCProvider client={...} /> где-то выше в иерархии!

const Basics = () => {
    const [calling, setCalling] = useState(false);
    const isConnected = useIsConnected();

    // App ID, Channel и Token теперь могут быть динамически установлены
    const [appId, setAppId] = useState("");
    const [channel, setChannel] = useState("");
    const [token, setToken] = useState("");
    const [uid, setUid] = useState("0"); // UID, 0 - для генерации Agora

    const [micOn, setMic] = useState(true);
    const [cameraOn, setCamera] = useState(true);

    // Создание локальных треков
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
    const { localCameraTrack } = useLocalCameraTrack(cameraOn);

    // ----------------------------------------------------
    // 1. Асинхронное получение токена и подключение
    // ----------------------------------------------------
    const fetchTokenAndJoin = async () => {
        if (!channel) return;

        try {
            const response = await api.post('/agora/token', {channelName: channel, uid: uid,});

            if (response.status > 300) {
                throw new Error('Failed to fetch token from Laravel server');
            }

            const data = await response.data;

            // Устанавливаем App ID и Токен, полученные с сервера
            setAppId(data.appId);
            setToken(data.token);

            // Начинаем звонок, активируя useJoin
            setCalling(true);

        } catch (error) {
            console.log(error, 'err');
            console.error("Error joining channel:", error);
            alert("Error: Could not join channel. See console for details.");
        }
    };

    // ----------------------------------------------------
    // 2. Хуки Agora
    // ----------------------------------------------------
    // useJoin использует полученные APP_ID, CHANNEL, TOKEN
    console.log(appId, token, channel,'fff');

    useJoin({ appid: appId, channel: channel, token: token ? token : null }, calling);

    // usePublish публикует локальные треки, когда calling = true
    usePublish([localMicrophoneTrack, localCameraTrack]);

    const remoteUsers = useRemoteUsers();

    // ----------------------------------------------------
    // 3. UI Компонент
    // ----------------------------------------------------
    return (
        <>
            <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
                <h2>Agora Video Call</h2>
                {isConnected ? (
                    <div>
                        <h3>Connected to Channel: {channel}</h3>
                        {/* Локальное видео */}
                        <div style={{ border: '2px solid green', marginBottom: '10px' }}>
                            <LocalUser
                                audioTrack={localMicrophoneTrack}
                                cameraOn={cameraOn}
                                micOn={micOn}
                                playAudio={false}
                                videoTrack={localCameraTrack}
                                style={{ width: '100%', height: 300 }}
                            >
                                <samp style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', position: 'absolute', padding: '5px' }}>
                                    You (UID: {uid == '0' ? 'Random' : uid})
                                </samp>
                            </LocalUser>
                        </div>

                        {/* Удаленные пользователи */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
                            {remoteUsers.map((user) => (
                                <div key={user.uid} style={{ border: '2px solid blue' }}>
                                    <RemoteUser user={user} style={{ width: '100%', height: 300 }}>
                                        <samp style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', position: 'absolute', padding: '5px' }}>
                                            Remote User: {user.uid}
                                        </samp>
                                    </RemoteUser>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>Enter channel name to join:</p>
                        <input
                            onChange={e => setChannel(e.target.value)}
                            placeholder="<Your Channel Name>"
                            value={channel}
                        />
                        <input
                            onChange={e => setUid(e.target.value)}
                            placeholder="<Your UID (or 0 for random)>"
                            value={uid}
                        />
                        {/* App ID и Token будут получены с сервера */}

                        <button
                            disabled={!channel}
                            onClick={fetchTokenAndJoin} // Используем функцию, которая сначала получает токен
                            style={{ padding: '10px', marginLeft: '10px' }}
                        >
                            <span>{calling ? "Connecting..." : "Join Channel"}</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Кнопки управления (видны, когда подключен) */}
            {isConnected && (
                <div style={{ padding: "10px", textAlign: 'center' }}>
                    <button onClick={() => setMic(a => !a)} style={{ margin: '5px' }}>
                        {micOn ? "🔇 Disable mic" : "🎤 Enable mic" }
                    </button>
                    <button onClick={() => setCamera(a => !a)} style={{ margin: '5px' }}>
                        {cameraOn ? "📸 Disable camera" : "📹 Enable camera" }
                    </button>
                    <button
                        onClick={() => setCalling(false)} // Установка calling в false вызывает useJoin для выхода
                        style={{ margin: '5px', backgroundColor: 'red', color: 'white' }}
                    >
                        🛑 End Call
                    </button>
                </div>
            )}
        </>
    );
};

export default Basics;