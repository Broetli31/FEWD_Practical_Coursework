import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';

const TalkDetail = ({talk, showState, closeHandler}) => {
    return (
        <Modal show={showState} onHide={closeHandler}>
            <Modal.Header closeButton>
                <Modal.Title>{talk.title} – Detail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Speaker: {talk.speaker}</strong></p>
                <p>Description: {talk.description}</p>
                <p>Time: {talk.time}</p>
                <p>Session {talk.session}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeHandler}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default TalkDetail;
