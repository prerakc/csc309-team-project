import "./styles.css";
import * as React from 'react';
import {Link} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import {useCallback} from "react";
import { Avatar } from '@mui/material';
import websiteIcon from "../../resources/open-book-icon-square.png"
import {AccountContext} from "../../context/AccountContext";
import { useContext } from 'react';

let pages = [];

export const NavBar = () => {
    const {profile} = useContext(AccountContext);
    
    if (profile.type === "admin") {
        pages = [
            '/home/listings',
            '/home/messages',
            '/home/profile',
            '/home/admin',
            '/auth/logout'
        ];
    } else {
        pages = [
            '/home/listings',
            '/home/messages',
            '/home/profile',
            '/auth/logout'
        ];
    }

    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = useCallback((event) => {
        setAnchorElNav(event.currentTarget);
    }, [setAnchorElNav]);

    const handleCloseNavMenu = useCallback(() => {
        setAnchorElNav(null);
    }, [setAnchorElNav]);

    return (
        <AppBar id="Nav">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Avatar
                            src={websiteIcon}
                            alt=""
                        />
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        id="Title"
                        sx={{display: {xs: 'none', md: 'flex'}}}
                    >
                        TutorMe
                    </Typography>

                    <Box className="GiveFlexGrow" sx={{display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            {pages.map((page) => (
                                <Link key={page} className="Link" to={`${page}`}>
                                    <MenuItem onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">
                                            {page.split("/")[page.split("/").length - 1]}
                                        </Typography>
                                    </MenuItem>
                                </Link>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        className="GiveFlexGrow"
                        sx={{display: {xs: 'flex', md: 'none'}}}
                    >
                        TutorMe
                    </Typography>
                    <Box className="GiveFlexGrow" sx={{display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (
                            <Link key={page} className="Link" to={`${page}`}>
                                <Button
                                    onClick={handleCloseNavMenu}
                                    className="Button"
                                >
                                    {page.split("/")[page.split("/").length - 1]}
                                </Button>
                            </Link>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};