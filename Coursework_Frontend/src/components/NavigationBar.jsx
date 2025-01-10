import {NavLink} from "react-router-dom";
import styled from "styled-components";

import {FaHome} from "react-icons/fa";

const NavBarLayout = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-self: center;
    border-radius: 50px;
    padding-left: 0;
    background-color: white;
    filter: drop-shadow(0 0 8px grey);

    .active {
        border: 2px white solid;
        background-color: blue;
        color: white;
    }

    a {
        text-decoration: none;
    }
`;

const StyledNavLink = styled(NavLink)`
    border: solid 2px lightgrey;
    padding: 5px 7px;
    border-radius: 200px;
    margin: 2px;
    text-align: center;
`;

const StickyNav = styled.nav`
    position: sticky;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    z-index: 1000;
`;

const NavigationBar = () => {

    return (
        <StickyNav>
            <NavBarLayout>
                <StyledNavLink to="/"><FaHome alt="Home" size={25}/></StyledNavLink>
                <StyledNavLink to="/itinerary">My Itinerary</StyledNavLink>
                <StyledNavLink to="/bookmarks">Bookmarks</StyledNavLink>
            </NavBarLayout>
        </StickyNav>
    )
}

export default NavigationBar;
