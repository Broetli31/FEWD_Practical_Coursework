import Star from "./Star.jsx";
import styled from "styled-components";

const StarRatingLayout = styled.div`
    text-align: center;
    
    svg {
        cursor: pointer;
    }
    
    p {
        display: inline-block;
        margin-left: 3px;
    }
`;
const StarRating = ({rating, avgRating, empty, onSelect}) => {

    return (
        <StarRatingLayout>
            {[...Array(5)].map((n, i) => (
                <Star key={i} selected={Math.round(rating) > i} empty={empty} onSelect={() => onSelect(i + 1)} />
            ))}
            <p>({avgRating.toFixed(1)})</p>
        </StarRatingLayout>
    );
};

export default StarRating;
