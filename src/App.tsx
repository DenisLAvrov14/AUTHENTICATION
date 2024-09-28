import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm/AuthForm';
import UserTable from './components/UserTable/UserTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/users" element={<UserTable />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
