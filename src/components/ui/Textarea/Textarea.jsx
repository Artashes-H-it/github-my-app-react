import styles from './Textarea.module.scss';

const Textarea = ({ onChange, placeholder, id, value, name, disabled}) => {
    return (
       <textarea id={id}  name={name} onChange={onChange} placeholder={placeholder} disabled={disabled} value={value}/>
    );
}

export default Textarea;