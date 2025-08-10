import React from 'react';
import { Box, Typography, Container, Grid, Button, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

// Import Social Media Icons for the footer
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

// Styled components for the Footer (retained from previous version)
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

// New Styled Components for the About Page Design
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '60vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(8, 4),
  background: 'linear-gradient(135deg, #e0f2f7 0%, #cce7f5 100%)', // Light blue gradient
  color: '#1a237e',
  borderRadius: '20px',
  marginBottom: theme.spacing(8),
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 2),
  },
}));

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  marginBottom: theme.spacing(8),
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 2),
  },
}));

const ValueCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  border: '1px solid #e0e0e0',
  borderRadius: '15px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: '50px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(45deg, #007aff 30%, #00c6ff 90%)',
  boxShadow: '0 4px 15px rgba(0, 122, 255, 0.3)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 20px rgba(0, 122, 255, 0.4)',
    background: 'linear-gradient(45deg, #005bb5 30%, #0099e6 90%)',
  },
}));

const AboutPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f7', pt: 8 }}>
      <Container maxWidth="lg">
        {/* Hero Section for About Page */}
        <HeroSection>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a237e' }}>
            About SmartHR: Empowering Sri Lankan Businesses
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 800, mx: 'auto', color: '#444' }}>
            We are dedicated to transforming HR processes for businesses of all sizes in Sri Lanka, making them smarter, faster, and more human.
          </Typography>
          <Typography variant="body1" sx={{ mt: 4, lineHeight: 1.8, maxWidth: 900, mx: 'auto', color: '#555' }}>
            Founded on the principle of simplifying complex HR tasks, SmartHR has grown into a leading provider of HR software solutions tailored for the Sri Lankan market. Our team comprises industry veterans, technology innovators, and HR specialists, all committed to creating a platform that not only meets but anticipates the unique needs of modern workplaces in our country. We believe that efficient HR is the backbone of a successful company, and our mission is to provide the tools that enable local businesses to focus on what they do best – innovate, grow, and empower their most valuable asset: their people.
          </Typography>
        </HeroSection>

        {/* Our Story/Journey Section */}
        <ContentSection sx={{ backgroundColor: '#ffffff' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 4 }}>
            Our Journey: From Vision to Reality
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <img
                  src="https://images.unsplash.com/photo-1551892589-865f69869476?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3VjY2VzcyUyMHN0b3J5fGVufDB8fDB8fHww" // Placeholder for an image representing growth/journey
                  alt="Our Story"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'left', pl: { md: 4 } }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
                  SmartHR began with a simple idea: to create an HR platform that truly understands and addresses the challenges faced by Sri Lankan businesses. We saw a need for a system that was not only powerful and comprehensive but also intuitive, affordable, and deeply integrated with local practices and regulations.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Since our inception, we've continuously evolved, incorporating feedback from our clients and staying abreast of the latest HR trends and technological advancements. Our dedication to local relevance and customer satisfaction has fueled our growth, making us a trusted partner for businesses across various sectors in Sri Lanka.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </ContentSection>

        {/* Mission, Vision & Values Section */}
        <ContentSection sx={{ backgroundColor: '#e9e9ed' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 4 }}>
            Our Purpose: Mission, Vision, Values
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'left', pr: { md: 4 }, mb: { xs: 4, md: 0 } }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#1a237e' }}>
                  Our Mission
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  To provide intuitive, efficient, and locally relevant HR management solutions that empower Sri Lankan businesses to optimize their human capital, fostering growth and compliance. We aim to simplify HR complexities, allowing organizations to focus on their core objectives.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'left', pl: { md: 4 } }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#1a237e' }}>
                  Our Vision
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  To be the leading HR software partner for Sri Lankan enterprises, recognized for our innovative technology, exceptional local support, and commitment to driving a more productive and harmonious work environment across the nation.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#333', mt: 8, mb: 4 }}>
            Our Core Values
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              { title: 'Innovation', description: 'Continuously developing cutting-edge features to meet evolving HR needs.' },
              { title: 'Customer-Centricity', description: 'Placing our customers at the heart of everything we do, from design to support.' },
              { title: 'Integrity', description: 'Upholding the highest standards of honesty and ethical practices in all interactions.' },
              { title: 'Local Empowerment', description: 'Committed to supporting and growing Sri Lankan businesses with tailored solutions.' },
              { title: 'Simplicity', description: 'Designing user-friendly interfaces that make complex HR tasks easy and accessible.' },
            ].map((value, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ValueCard>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#007aff', mb: 1.5 }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </ValueCard>
              </Grid>
            ))}
          </Grid>
        </ContentSection>

        {/* Why Choose SmartHR for Sri Lanka? Section */}
        <ContentSection sx={{ backgroundColor: '#ffffff' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 4 }}>
            Why SmartHR for Your Sri Lankan Business?
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <img
                  src="https://ichef.bbci.co.uk/ace/branded_news/1200/cpsprodpb/9172/production/_129043273_bbcm_sri-lanka_country_profile_map_170323.png" // Placeholder for a map or local icon
                  alt="Sri Lanka Focus"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'left', pl: { md: 4 } }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
                  We understand the unique challenges and opportunities faced by businesses in Sri Lanka. SmartHR is built with **local regulations**, **cultural nuances**, and **economic realities** in mind, ensuring our platform is not just powerful, but perfectly suited for your context.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  From navigating local labor laws to supporting diverse workforces, SmartHR provides features that are directly applicable and beneficial to Sri Lankan companies. Our dedicated **local support team** is always ready to assist, ensuring you get the most out of our system without any language or cultural barriers.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </ContentSection>

        {/* Call to Action */}
        <ContentSection sx={{ backgroundColor: '#e9e9ed' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#333' }}>
            Ready to Transform Your HR?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 700, mx: 'auto' }}>
            Join the growing number of Sri Lankan businesses streamlining their HR with SmartHR.
          </Typography>
          <StyledButton variant="contained" component={Link} to="/contact" sx={{ mt: 4 }}>
            Get in Touch Today
          </StyledButton>
        </ContentSection>
      </Container>

      {/* Footer */}
        <StyledFooter
          sx={{
            backgroundColor: '#cde6ffff'
          }}
        >
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

export default AboutPage;