import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Button, IconButton, TextField } from '@mui/material';
import { styled } from '@mui/system';

// Import Material-UI Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

// Styled components for the Footer
const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8f8f8',
  padding: theme.spacing(6, 0),
  borderTop: '1px solid #eee',
}));

const FooterLink = styled('a')(({ theme }) => ({
  color: '#555',
  textDecoration: 'none',
  marginBottom: theme.spacing(1),
  fontSize: '0.95rem',
  '&:hover': {
    color: '#007aff',
    textDecoration: 'underline',
  },
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  color: '#888',
  '&:hover': {
    color: '#007aff',
    backgroundColor: 'transparent',
  },
}));

// Hero Section
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '40vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(8, 4),
  background: 'linear-gradient(135deg, #e0f2f7 0%, #cce7f5 100%)',
  color: '#1a237e',
  borderRadius: '20px',
  marginBottom: theme.spacing(8),
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 2),
  },
}));

// Resource Card Styles
const ResourceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
  },
}));

const ResourceImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 200,
  objectFit: 'cover',
  borderTopLeftRadius: theme.shape.borderRadius * 2,
  borderTopRightRadius: theme.shape.borderRadius * 2,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: '12px 30px',
  borderRadius: '30px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(45deg, #007aff 30%, #00c6ff 90%)',
  boxShadow: '0 4px 10px rgba(0, 122, 255, 0.2)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(0, 122, 255, 0.3)',
    background: 'linear-gradient(45deg, #005bb5 30%, #0099e6 90%)',
  },
}));

const ResourcesPage = () => {
  const featuredContent = [
    {
      image: 'https://placehold.co/400x200/FFDDC1/000000?text=HR+Guide',
      title: 'Guide to Streamlining HR Processes',
      description: 'Learn how to automate payroll and manage leave efficiently with SHRM insights.',
      link: 'https://www.aihr.com/blog/hr-processes/',
    },
    {
      image: 'https://placehold.co/400x200/D4A5A5/FFFFFF?text=Webinar+Recording',
      title: 'Webinar: The Future of HR in 2025',
      description: 'Watch Gartner’s recorded webinar on HR tech trends and workforce planning.',
      link: 'https://www.traliant.com/resources/webinar-the-future-of-hr-navigating-change-in-2025/',
    },
    {
      image: 'https://placehold.co/400x200/B8D8D8/000000?text=Blog+Post',
      title: '5 Ways to Boost Employee Engagement',
      description: 'Check out Forbes’ expert advice on keeping employees motivated and productive.',
      link: 'https://www.oak.com/blog/improve-employee-engagement/',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f7', pt: 8, display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 8 }}>
        {/* Hero Section */}
        <HeroSection>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a237e' }}>
            SmartHR Resource Center
          </Typography>
          <Typography variant="h6" paragraph sx={{ maxWidth: 800, mx: 'auto', color: '#444' }}>
            Explore HR best practices, guides, and expert insights to help your organization thrive.
          </Typography>
        </HeroSection>

        {/* Featured Content Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, color: '#333', textAlign: 'center', mb: 5 }}>
            Featured Content
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {featuredContent.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ResourceCard>
                  <ResourceImage src={item.image} alt={item.title} />
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, color: '#444' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 2, textTransform: 'none', borderRadius: '20px' }}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read More
                    </Button>
                  </CardContent>
                </ResourceCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Newsletter Section */}
        <Box sx={{ backgroundColor: '#ffffff', p: 6, borderRadius: '20px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)', textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#333' }}>
            Stay Up to Date with HR Insights
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Subscribe to our newsletter for the latest HR trends, tips, and resources.
          </Typography>
          <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Enter your email"
              variant="outlined"
              type="email"
              sx={{ minWidth: { xs: '100%', sm: 300 }, '& .MuiOutlinedInput-root': { borderRadius: '30px' } }}
            />
            <StyledButton variant="contained" type="submit">
              Subscribe
            </StyledButton>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <StyledFooter>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="space-between">
            {/* Company Info */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img src="/images/smarthr-logo.png" alt="SmartHR Logo" style={{ height: 40, marginRight: 10 }} />
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
                  SmartHR
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                SmartHR is a comprehensive Human Resources Management System designed to streamline HR operations.
              </Typography>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FooterLink href="https://www.shrm.org/" target="_blank" rel="noopener noreferrer">Home</FooterLink>
                <FooterLink href="https://www.shrm.org/resourcesandtools" target="_blank" rel="noopener noreferrer">Features</FooterLink>
                <FooterLink href="https://www.gartner.com/en/human-resources" target="_blank" rel="noopener noreferrer">Pricing</FooterLink>
                <FooterLink href="https://about.linkedin.com/" target="_blank" rel="noopener noreferrer">About Us</FooterLink>
                <FooterLink href="https://www.linkedin.com/company/shrm" target="_blank" rel="noopener noreferrer">Contact Us</FooterLink>
              </Box>
            </Grid>

            {/* Resources */}
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
                Resources
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FooterLink href="https://www.shrm.org/hr-today/news/hr-magazine/pages/default.aspx" target="_blank" rel="noopener noreferrer">Blog</FooterLink>
                <FooterLink href="https://www.forbes.com/work/" target="_blank" rel="noopener noreferrer">FAQ</FooterLink>
                <FooterLink href="https://www.gartner.com/en/human-resources" target="_blank" rel="noopener noreferrer">Support</FooterLink>
                <FooterLink href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</FooterLink>
                <FooterLink href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</FooterLink>
              </Box>
            </Grid>

            {/* Contact Us */}
            <Grid item xs={12} sm={4} md={3}>
              <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
                Contact Us
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                123 HR Solutions St.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Suite 400, Business City
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                info@smarthr.com
              </Typography>
              <Typography variant="body2" color="text.secondary">
                +1 (555) 123-4567
              </Typography>

              {/* Social Media */}
              <Box sx={{ mt: 3 }}>
                <SocialIconButton aria-label="facebook" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <FacebookIcon />
                </SocialIconButton>
                <SocialIconButton aria-label="twitter" href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <TwitterIcon />
                </SocialIconButton>
                <SocialIconButton aria-label="linkedin" href="https://linkedin.com/company/shrm" target="_blank" rel="noopener noreferrer">
                  <LinkedInIcon />
                </SocialIconButton>
                <SocialIconButton aria-label="instagram" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <InstagramIcon />
                </SocialIconButton>
              </Box>
            </Grid>
          </Grid>

          {/* Copyright */}
          <Box sx={{ borderTop: '1px solid #eee', pt: 3, mt: 5, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} SmartHR. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </StyledFooter>
    </Box>
  );
};

export default ResourcesPage;