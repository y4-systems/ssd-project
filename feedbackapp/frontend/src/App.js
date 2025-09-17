import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {

  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to react app</h1>  
        <button className='users-button' onClick={() => navigate('/OptionPage')}>Give feedback</button> <br/>
        <button className='users-button' onClick={() => navigate('/AdminFeedbackView')}>AdminFeedbackView</button>
      </header>
    </div>
  );
}

export default App;
