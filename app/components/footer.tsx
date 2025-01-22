import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.branding}>
          {/* <h2 style={styles.brandingTitle}>Melos</h2> */}
          <p style={styles.brandingText}>
            &copy; {currentYear} Melos. All rights reserved.
          </p>
        </div>
        <div style={styles.links}>
          <a href="/" style={styles.link}>
            Privacy Policy
          </a>
          <a href="/" style={styles.link}>
            Terms of Service
          </a>
          <a href="/" style={styles.link}>
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#00bcd4", // Cyan background
    color: "#ffffff", // White text
    padding: "10px 0", // Reduced padding
    textAlign: "center",
    boxShadow: "0 -2px 15px rgba(0,0,0,0.1)",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "0 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  branding: {
    marginBottom: "10px", // Reduced margin
  },
  brandingTitle: {
    fontSize: "36px",
    margin: "0",
    fontWeight: "bold",
    letterSpacing: "1px",
    color: "#ffffff",
  },
  brandingText: {
    fontSize: "16px",
    color: "#ffffff",
    marginTop: "5px", // Reduced margin
  },
  links: {
    display: "flex",
    gap: "10px", // Adjusted gap for better spacing
    marginBottom: "10px", // Reduced margin
    justifyContent: "center",
  },
  link: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
};

export default Footer;
