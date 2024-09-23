import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm/AuthForm';
import UserTable from './components/UserTable/UserTable';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/users" element={<UserTable />} />
      </Routes>
    </Router>
  );
}

export default App;
