import NavBar from "../pages/budgetManagement/navBar/NavBar";
import SideBar from "../pages/budgetManagement/sideBar/SideBar";
import PropTypes from "prop-types";

const FMLayout = ({ children }) => {
  return (
    <div>
      <div className="navigation-container">
        <SideBar />
        <NavBar />
      </div>

      <div className="main-content">{children}</div>
    </div>
  );
};

FMLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FMLayout;