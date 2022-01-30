import { Button, Container, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import Link from '../src/components/Link';

const IndexPage = () => (
  <Container maxWidth="md">
    <Box sx={{ my: 4 }}>
      <Typography component="h1" variant='h1'>Hi, I'm António 👋</Typography>
      <Box maxWidth="sm">
        <Button variant="contained" component={Link} noLinkStyle href="/posts/hello-world">
          My first post
        </Button>
        </Box>
      <Typography>
        <Link href="/about">
          About
        </Link>
      </Typography>
      <Typography>
        <Link href="https://rideandlisten.antoniogoulao.dev/">
          Ride & Listen
        </Link>
      </Typography>
    </Box>
  </Container>
)

export default IndexPage;