import { useState } from "react";
import { Label, Textarea, Button } from "../components/ui";
import api from "../api/axios";

const AIAssistent = () => {

    const [formData, setFormData] = useState({ prompt: '' });
    const [errors, setErrors] = useState({});
    const [aiContent, setAiContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChage = (e) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        validateField(name, value);
    }

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "prompt":
                if (!value) error = "Prompt is required";
                break;
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
    }

    const hendleSubmit = async (e) => {
        setLoading(true);
        try {
            const response = await api.post("/ai-assistant", formData);
            console.log(response.data.data.text)
            setAiContent(response.data.data.text);
 setLoading(false);
        } catch (error) {
            alert("Error submitting form", error);
        }
    }

    return (
        <>
            <div className="wrap-ai">
                <Label htmlFor="email" required>
                    Your prompt
                </Label>
                <Textarea id="prompt" name={'prompt'} onChange={handleChage} placeholder={'prompt'} value={formData.prompt} />
                <p>{errors.prompt && <span style={{ color: "red" }}>{errors.prompt}</span>}</p>
                <Button type='button' onClick={hendleSubmit}>Send</Button>
            </div>
            { loading && (
                <div>
                    Loading...
                </div>
            )}
            {aiContent && (
                <div className="content">
                    {aiContent}
                </div>
            )
            }
        </>

    )
};

export default AIAssistent;