import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from './../api/axios';
import logout from "../utils/logout";

export default function EmailVerify() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("Подтверждение email...");
    const navigate = useNavigate();

    useEffect(() => {
        const id = searchParams.get("id");
        const hash = searchParams.get("hash");

        if (!id || !hash) {
            setStatus("Некорректная ссылка");
            return;
        }

        api.post("/email/verify", { id, hash })
            .then(() => {
                localStorage.setItem('verified', true)
                setStatus("Email успешно подтверждён!")
            })
            .catch(() => setStatus("Ошибка подтверждения. Попробуйте снова."));
    }, []);

    const handleGoToLogin = async () => {
        await logout();
        navigate("/login"); 
    };

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2>{status}</h2>
            {status === "Email успешно подтверждён!" && (
                <button
                    onClick={handleGoToLogin}
                    style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
                >
                    Войти
                </button>
            )}
        </div>
    );
}
