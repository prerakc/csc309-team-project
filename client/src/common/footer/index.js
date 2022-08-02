import "./styles.css";
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const Footer = () => {
    return (
        <Box bgcolor="text.secondary" color="white" className="footer">
            <div className="footerText">
                <Typography>
                    Copyright &copy; 2022 TutorMe. All Rights Reserved
                </Typography>
            </div>
        </Box>
    );
};