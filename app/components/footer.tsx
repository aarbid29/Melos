import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.branding}>
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
    backgroundColor: "#ffffff",
    color: "#333333",
    padding: "10px 0",
    textAlign: "center",
    borderTop: "1px solid #e5e5e5",
    boxShadow: "0 -2px 15px rgba(0,0,0,0.05)",
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
    marginBottom: "10px",
  },
  brandingText: {
    fontSize: "16px",
    color: "#333333",
    marginTop: "5px",
  },
  links: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    justifyContent: "center",
  },
  link: {
    color: "#333333",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
};

export default Footer;
