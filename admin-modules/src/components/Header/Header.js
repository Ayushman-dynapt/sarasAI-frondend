import React from 'react';
import Grid from '@mui/material/Grid';
import sarasai_logo from '../../assets/sarasai_logo.jpeg';
import Profile from './Profile';


const Header = () => {
    return (
        <header>  
            <Grid container spacing={1} sx={{bgcolor: 'white', p: 1, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)' }}>
                <Grid item xs={1.5} sx={{display:'flex', alignItems:'center', textAlign:'center' ,justifyContent:'flex-start'}}>
                    <img src={sarasai_logo} alt="Sarasai logo" style={{ width: '56px', height:'56px' }} />
                    <span>
                        <p className='title'>SARAS AI</p>
                        <p className='sub-title'>INSTITUTE</p>
                    </span>
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={3} sx={{display:'flex',flexDirection:'row',justifyContent:'space-around', alignItems:'center'}}>
                    <span className='text-grey'>Message</span>
                    <span className='text-grey'>Notification</span>
                    <span className='text-grey'>Settings</span>
                </Grid>
                <Grid item xs={1.5}>
                    <Profile />
                </Grid>
            </Grid>
        </header>
    );
    }

export default Header;