import './App.css';
import Header from './components/Header/Header';
import Grid from '@mui/material/Grid';
import Sidebar from './components/Sidebar/Sidebar';
import ManagesTAs from './pages/managesTAs/ManagesTAs';

function App() {
  return (
    <div className="App">
     <Grid container spacing={0.5}>
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={2}>
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
