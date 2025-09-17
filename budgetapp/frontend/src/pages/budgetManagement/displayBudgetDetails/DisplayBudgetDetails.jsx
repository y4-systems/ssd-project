import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./displayBudgetDetails.css";
import html2pdf from "html2pdf.js";
import { Link } from "react-router-dom";

const DisplayBudgetDetails = () => {
  const { id } = useParams();
  const [budget, setBudget] = useState(null);
  const componentRef = useRef();

  useEffect(() => {
    const fetchBudgetDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/getOneBudget/${id}`
        );
        setBudget(response.data);
      } catch (error) {
        console.error("Error Fetching Budget Details:", error);
      }
    };
    fetchBudgetDetails();
  }, [id]);

  const handleDownload = () => {
    if (componentRef.current) {
      const opt = {
        margin: 1,
        filename: 'budget_report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().from(componentRef.current).set(opt).save();
    }
  };

  return (
    <div className="addBudget">
        <Link to={"/displayBudgets"}>Back</Link>
      
      {budget && (
        <div>
          <h2 className="budget-details-heading">Budget Details</h2>
          <div className="budget-details" ref={componentRef}>
            <p>
              <strong>Event ID:</strong> {budget.eventID}
            </p>
            <p>
              <strong>Groom's Name:</strong> {budget.groomName}
            </p>
            <p>
              <strong>Bride's Name:</strong> {budget.brideName}
            </p>
            <p>
              <strong>Packages:</strong> {budget.packages}
            </p>
            <p>
              <strong>Estimated Budget:</strong> {budget.estimatedBudget}
            </p>
            <p>
              <strong>Additional Notes:</strong> {budget.additionalNotes}
            </p>
          </div>
        </div>
      )}
      <button className="download-button" onClick={handleDownload}>
        Download Budget Report
      </button>
    </div>
  );
};

export default DisplayBudgetDetails;
