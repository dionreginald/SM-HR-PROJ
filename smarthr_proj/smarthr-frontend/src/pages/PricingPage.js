import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Button, ToggleButton, ToggleButtonGroup, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

// Import Social Media Icons for the footer
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

// Styled components for the Pricing Cards
const StyledPricingCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 3, // More rounded corners
  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  },
  backgroundColor: '#ffffff',
  padding: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid #e0e0e0',
}));

const PriceDisplay = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  textAlign: 'center',
}));

const PriceText = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
  fontWeight: 700,
  color: '#007aff',
  lineHeight: 1,
  span: {
    fontSize: '0.5em',
    fontWeight: 400,
    verticalAlign: 'super',
    marginRight: theme.spacing(0.5),
    color: '#666',
  },
}));

const FeatureList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  marginBottom: theme.spacing(4),
  li: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
    color: '#555',
    fontSize: '1rem',
    '&::before': {
      content: '"✔"',
      color: '#28a745', // Green checkmark
      marginRight: theme.spacing(1.5),
      fontWeight: 600,
      fontSize: '1.2em',
    },
  },
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  backgroundColor: '#e0e0e0',
  borderRadius: '50px',
  padding: '4px',
  '.MuiToggleButton-root': {
    borderRadius: '50px !important',
    textTransform: 'none',
    fontWeight: 600,
    color: '#555',
    '&.Mui-selected': {
      backgroundColor: '#007aff',
      color: '#ffffff',
      boxShadow: '0 4px 10px rgba(0, 122, 255, 0.2)',
      '&:hover': {
        backgroundColor: '#007aff',
      },
    },
    '&:hover': {
      backgroundColor: '#d0d0d0',
    },
  },
}));

// Styled components for the Footer
const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8f8f8',
  padding: theme.spacing(6, 0),
  borderTop: '1px solid #eee',
}));

const FooterLink = styled(Link)(({ theme }) => ({
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


const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' or 'annually'

  const handleBillingPeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      setBillingPeriod(newPeriod);
    }
  };

  const pricingPlans = [
    {
      name: 'Basic',
      monthlyPrice: 2500, // LKR
      annualPrice: 2500 * 10, // 2 months free
      perUserPrice: 500, // LKR per user per month
      features: [
        'Up to 10 Employees',
        'Authentication & Admin Access',
        'Admin Profile Management',
        'Basic Employee Management',
        'Email Support'
      ],
      buttonText: 'Start Free Trial',
      link: '/register',
    },
    {
      name: 'Standard',
      monthlyPrice: 5000, // LKR
      annualPrice: 5000 * 10, // 2 months free
      perUserPrice: 400, // LKR per user per month
      isPopular: true,
      features: [
        'Up to 50 Employees',
        'All Basic Features',
        'Full Employee Management',
        'Basic Payroll Management',
        'Leave Request Management',
        'Priority Email & Chat Support'
      ],
      buttonText: 'Get Started',
      link: '/register',
    },
    {
      name: 'Premium',
      monthlyPrice: 10000, // LKR
      annualPrice: 10000 * 10, // 2 months free
      perUserPrice: 300, // LKR per user per month
      features: [
        'Unlimited Employees',
        'All Standard Features',
        'Advanced Payroll Processing',
        'Dashboard Overview',
        'Database Connectivity',
        'Dedicated Account Manager',
        '24/7 Phone Support'
      ],
      buttonText: 'Contact Sales',
      link: '/contact',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f7', py: 10, pt: 12 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#333' }}>
            Flexible Pricing Plans
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 700, mx: 'auto' }}>
            Choose the SmartHR plan that best suits your business needs and budget.
          </Typography>

          <StyledToggleButtonGroup
            value={billingPeriod}
            exclusive
            onChange={handleBillingPeriodChange}
            aria-label="billing period"
          >
            <ToggleButton value="monthly">Monthly Billing</ToggleButton>
            <ToggleButton value="annually">Annual Billing (Save 17%)</ToggleButton>
          </StyledToggleButtonGroup>
        </Box>

        <Grid container spacing={4} alignItems="stretch" justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <StyledPricingCard elevation={plan.isPopular ? 8 : 2}>
                {plan.isPopular && (
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: '#ff5722',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderBottomLeftRadius: '20px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    zIndex: 1,
                  }}>
                    Most Popular
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 2 }}>
                    {plan.name}
                  </Typography>
                  <PriceDisplay>
                    <PriceText>
                      <span>LKR</span>
                      {billingPeriod === 'monthly' ? plan.monthlyPrice.toLocaleString('en-LK') : plan.annualPrice.toLocaleString('en-LK')}
                    </PriceText>
                    <Typography variant="body2" color="text.secondary">
                      {billingPeriod === 'monthly' ? 'per month' : 'per year'}
                    </Typography>
                    {plan.perUserPrice && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        + LKR {plan.perUserPrice.toLocaleString('en-LK')} per user/month
                      </Typography>
                    )}
                  </PriceDisplay>

                  <FeatureList>
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </FeatureList>

                  <Button
                    variant="contained"
                    component={Link}
                    to={plan.link}
                    sx={{
                      mt: 'auto', // Pushes button to the bottom
                      padding: '12px 30px',
                      borderRadius: '50px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(45deg, #007aff 30%, #00c6ff 90%)',
                      boxShadow: '0 4px 15px rgba(0, 122, 255, 0.3)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0, 122, 255, 0.4)',
                        background: 'linear-gradient(45deg, #005bb5 30%, #0099e6 90%)',
                      },
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </StyledPricingCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.8 }}>
            All prices are in Sri Lankan Rupees (LKR) and exclude applicable taxes. Annual billing offers a discount equivalent to two months free. For custom enterprise solutions or more than 100 employees, please contact our sales team for a personalized quote.
          </Typography>
        </Box>
      </Container>

      {/* Footer */}
      <StyledFooter>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="space-between">
            {/* Company Info / Logo */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img src="/images/smarthr-logo.png" alt="SmartHR Logo" style={{ height: 40, marginRight: 10 }} />
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
                  SmartHR
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                SmartHR is a comprehensive Human Resources Management System designed to streamline HR operations,
                from employee management and payroll to leave requests and notifications.
              </Typography>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FooterLink to="/">Home</FooterLink>
                <FooterLink to="/features">Features</FooterLink>
                <FooterLink to="/pricing">Pricing</FooterLink>
                <FooterLink to="/about">About Us</FooterLink>
                <FooterLink to="/contact">Contact Us</FooterLink>
              </Box>
            </Grid>

            {/* Resources */}
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
                Resources
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FooterLink to="/resources">Blog</FooterLink>
                <FooterLink to="/faq">FAQ</FooterLink>
                <FooterLink to="/support">Support</FooterLink>
                <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
                <FooterLink to="/terms-of-service">Terms of Service</FooterLink>
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
                <SocialIconButton aria-label="facebook" href="https://facebook.com" target="_blank">
                  <FacebookIcon />
                </SocialIconButton>
                <SocialIconButton aria-label="twitter" href="https://twitter.com" target="_blank">
                  <TwitterIcon />
                </SocialIconButton>
                <SocialIconButton aria-label="linkedin" href="https://linkedin.com" target="_blank">
                  <LinkedInIcon />
                </SocialIconButton>
                <SocialIconButton aria-label="instagram" href="https://instagram.com" target="_blank">
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

export default PricingPage;
