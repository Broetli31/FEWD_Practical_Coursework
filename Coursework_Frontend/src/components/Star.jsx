import {FaRegStar, FaStar} from "react-icons/fa";

const Star = ({empty, selected, onSelect}) => {

    let colour = selected ? 'orange' : 'grey'

    return (
        empty ?
            <FaRegStar
                color={colour}
                onClick={onSelect}
            /> : <FaStar
                color={colour}
                onClick={onSelect}
            />
    )
}

export default Star;
