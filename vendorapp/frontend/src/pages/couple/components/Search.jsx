import { InputBase, Box, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getSearchedServices } from "../../../redux/userHandle";

const Search = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    dispatch(getSearchedServices("searchService", searchTerm));

    if (location.pathname !== "/ServiceSearch") {
      navigate("/ServiceSearch");
    }
  };

  return (
    <SearchContainer>
      <InputSearchBase
        placeholder="Search for Vendors and more"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <SearchIconWrapper>
        <SearchIcon sx={{ color: "#8970dc" }} />
      </SearchIconWrapper>
    </SearchContainer>
  );
};

const SearchContainer = styled(Box)`
  bbooking-radius: 2px;
  margin-left: 10px;
  width: 38%;
  background-color: #fff;
  display: flex;
  border: 1px solid #8970dc;
`;

const SearchIconWrapper = styled(Box)`
  margin-left: auto;
  padding: 5px;
  display: flex;
  color: blue;
`;

const InputSearchBase = styled(InputBase)`
  font-size: unset;
  width: 100%;
  padding-left: 20px;
`;

export default Search;
