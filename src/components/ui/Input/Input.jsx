import style from './Input.module.scss'

const Input = ({ onChange, type, placeholder, id, value, name}) => {
    return (
       <input id={id} type={type} name={name} onChange={onChange} placeholder={placeholder} value={value}/>
    );
}

export default Input;