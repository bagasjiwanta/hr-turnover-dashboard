import { Button, FormControl, FormHelperText, Input, InputLabel, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { SIDEBAR_WIDTH } from "../components/Sidebar";

export default function Login() {
  const [data, setData] = useState({
    email: '',
    password: ''
  })
  return (
    <Box  sx={{display:'flex', alignItems:'center', justifyContent:'center', width: '100%', height:'100%'}}>

    <Box sx={{
      marginTop: '5em',
      width:'400px',
      borderRadius: "16px",
      padding:"2em",
      backgroundColor:'white',
      display:'flex',
      flexDirection:'column',
      gap:'1em'
    }}>
      <TextField id="email" label="Email Address" type="email"/>
      <TextField id="password" label="Password" type="password"/>
      
        <Button>Login</Button>
        <Button>Sign Up</Button>

    </Box>
    </Box>
  )
}