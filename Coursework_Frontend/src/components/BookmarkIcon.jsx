import {FaBookmark, FaRegBookmark} from "react-icons/fa";
import styled from "styled-components";

const StyledDiv = styled.div`
    color: darkred;
    cursor: pointer;
`;

const BookmarkIcon = ({isBookmarked, onClick}) => {
    const iconSize = 22;

    return (
        <StyledDiv onClick={onClick}>
            {isBookmarked ? (<FaBookmark size={iconSize}/>) : (<FaRegBookmark size={iconSize}/>)}
        </StyledDiv>
    )
}

export default BookmarkIcon;
