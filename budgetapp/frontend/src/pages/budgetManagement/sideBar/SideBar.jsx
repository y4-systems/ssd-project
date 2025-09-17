import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import { budgetDashboard, budgetBudget, budgetExpense, budgetIncome, budgetPackage, budgetLogout } from "../../../assets/budgetImages/budgetIcons";

const SideBar = () => {
  const menuItems = [
    {
      text: "Dashboard",
      icon: budgetDashboard,
      link: "/",
    },
    {
      text: "Budgets",
      icon: budgetBudget,
      link: "/displayBudgets",
    },
    {
      text: "Incomes & Expenses",
      icon: budgetExpense,
      link: "/displayIncomesExpenses",
    },
    {
      text: "All Transactions",
      icon: budgetIncome,
      link: "/displayTransactions",
    }
  ];

  const footerItems = [
    {
      text: "Logout",
      icon: budgetLogout,
      link: "/",
    },
  ];

  return (
    <div className="side-nav-container">
      <div className="nav-upper">
        <div className="nav-heading">
          <div className="nav-brand">
            <h2>Blissify</h2>
          </div>
        </div>
        <div className="nav-menu">
          {menuItems.map(({ text, icon, link }) => (
            <Link key={text} to={link} className="menu-item">
              <p className="menu-item-icon">{icon}</p>
              <p>{text}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="nav-menu">
        {footerItems.map(({ text, icon, link }) => (
          <Link key={text} to={link} className="menu-item">
            <p className="menu-item-icon">{icon}</p>
            <p>{text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
