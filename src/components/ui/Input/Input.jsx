import style from './Input.module.scss'

const Input = ({ onChange, type, placeholder, id, value, name, disabled}) => {
    return (
       <input id={id} type={type} name={name} onChange={onChange} placeholder={placeholder} disabled={disabled} value={value}/>
    );
}

export default Input;