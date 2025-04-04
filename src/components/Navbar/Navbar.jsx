import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import "../../styles/global.css"

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#ffffff', boxShadow: 0, padding: '0.5rem 1rem' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

        <Box  display="flex" alignItems="center">
        <a class="navbar-brand" href="#"><span class="logo-title">C</span>lick<span
                    class="logo-title">W</span>ork</a>
        </Box>

        <Box display={{ xs: 'none', md: 'flex' }}>
          <Button sx={{ color: 'gray', fontWeight: 'bold' }}>Trang chủ</Button>
          <Button sx={{ color: 'gray', fontWeight: 'bold' }}>Tất cả việc làm</Button>
          <Button sx={{ color: 'gray', fontWeight: 'bold' }}>Nhà tuyển dụng</Button>
        </Box>

        <Box>
          <Button sx={{ color: "var(--primary-color)" }} href="#">
            Đăng nhập
          </Button>
          <Button className='btn-action' href="#">
            Đăng ký
          </Button>
        </Box>

        <IconButton color="primary" sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
