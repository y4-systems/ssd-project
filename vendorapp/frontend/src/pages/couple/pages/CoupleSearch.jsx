import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/system";
import Services from "../../../components/Services";
import { useDispatch, useSelector } from "react-redux";
import { getSearchedServices } from "../../../redux/userHandle";

const CoupleSearch = ({ mode }) => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");

  const { filteredServices } = useSelector((state) => state.user);

  const handleSearch = (e) => {
    e.preventDefault();

    dispatch(getSearchedServices("searchService", searchTerm));
  };

  return (
    <div>
      {mode === "Mobile" ? (
        <>
          <SearchContainer onSubmit={handleSearch}>
            <TextField
              label="Search for services, brands and more"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                style: {
                  bbookingRadius: 0,
                },
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          {searchTerm && <Services serviceData={filteredServices} />}
        </>
      ) : (
        <>{filteredServices && <Services serviceData={filteredServices} />}</>
      )}
    </div>
  );
};

const SearchContainer = styled("form")({
  display: "flex",
  justifyContent: "center",
  padding: "16px",
});

export default CoupleSearch;
