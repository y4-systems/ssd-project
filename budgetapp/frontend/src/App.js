import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import FMLayout from "./layouts/FMLayout";
import AddBudget from './pages/budgetManagement/addBudget/AddBudget';
import { GetBudget } from './pages/budgetManagement/getBudget/GetBudget';
import UpdateBudget from './pages/budgetManagement/updateBudget/UpdateBudget';
import DisplayBudgets from './pages/budgetManagement/displayBudgets/DisplayBudgets';
import BudgetDashboard from './pages/budgetManagement/budgetDashboard/BudgetDashboard';
import IncomesExpenses from './pages/budgetManagement/incomes&expenses/IncomesExpenses';
import AllTransactions from './pages/budgetManagement/allTransactions/AllTransactions';
import DisplayBudgetDetails from './pages/budgetManagement/displayBudgetDetails/DisplayBudgetDetails';

function App() {
  return (
      <div className="App">
        <BrowserRouter>

        
          <FMLayout>
            <Routes>
              <Route path="/" element={<BudgetDashboard />} />
              <Route path="/displayBudgets" element={<DisplayBudgets />} />
              <Route path="/getBudget" element={<GetBudget />} />
              <Route path="/addBudget" element={<AddBudget />} />
              <Route path="/updateBudget/:id" element={<UpdateBudget />} />
              <Route path="/displayIncomesExpenses" element={<IncomesExpenses />} />
              <Route path="/displayTransactions" element={<AllTransactions />} />
              <Route path='/budget/:id' element={<DisplayBudgetDetails/>}/>
              
            </Routes>
          </FMLayout>
          
        </BrowserRouter>
      </div>
  );
}

export default App;