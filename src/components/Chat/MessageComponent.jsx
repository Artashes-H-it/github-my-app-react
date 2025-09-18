import styles from './Chat.module.scss';
import { formatRelativeDate } from '../../utils/utils';
import del from '../../assets/icons/del.png';

const MessagesComponent = ({messages, currentUser, item, index, deleteMess }) => {


    return (
        <>
            {formatRelativeDate(item.created_at, messages[index - 1]?.created_at) && <h6>{formatRelativeDate(item.created_at, messages[index - 1]?.created_at)}</h6>}
            <p className={`${currentUser == item.sender_id ? styles.sender : ''}`} key={index}>
                <span>{item.body}</span>
                <img src={del} alt="delte" onClick={() => { deleteMess(item.id) }} />
            </p>
            {item.file_url && (
                <>
                    {item.file_url.endsWith(".pdf") ? (
                        <a className={`${styles.chatMessageAttachment} ${currentUser == item.sender_id ? styles.sender : ''}`} href={item.file_url} target="_blank" rel="noreferrer">
                            Скачать PDF
                        </a>
                    ) : (
                        <img className={`${styles.chatMessageAttachment} ${currentUser == item.sender_id ? styles.sender : ''}`} src={item.file_url} alt="Attachment" />
                    )}
                </>
            )}
        </>
    )
}

export default MessagesComponent;