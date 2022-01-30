import { Box, Button, Container, Typography } from "@mui/material"
import React from "react"
import Link from "../../src/components/Link"

const HelloWorld = () => {
    return (
    <Container maxWidth="lg">
    <Box
      sx={{
        my: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
        <Typography>Hello World</Typography>
        <Box maxWidth="sm">
          <Button variant="contained" component={Link} noLinkStyle href="/">
            Go to the home page
          </Button>
        </Box>
      </Box>
    </Container>
    )
}

export default HelloWorld;