import './App.css';
import Header from './components/Header/Header';
import Grid from '@mui/material/Grid';
import Sidebar from './components/Sidebar/Sidebar';
import ManagesTAs from './pages/managesTAs/ManagesTAs';
import { Box } from '@mui/material';

function App() {
  return (
    <div className="App">
      <Grid container spacing={0.5}>
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={2} sx={{ background: 'linear-gradient(to bottom, #362f9c, #7931a3)', height: '90vh'}}>
            <Sidebar />
        </Grid>
        <Grid item xs={10}>
          <ManagesTAs/>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
