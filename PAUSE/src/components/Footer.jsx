// src/components/Footer.js
import '../app.css'; // Adjust styling here if needed

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* Newsletter Subscription */}
        {/* <div className="newsletter-section">
          <h4>Subscribe to Our Newsletter</h4>
          <p>Stay updated with the latest events in Copenhagen.</p>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email"
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-button">Subscribe</button>
          </form>
        </div> */}

        {/* Social Media Links */}
        <div className="social-media-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        {/* Contact Information */}
        <div className="contact-section">
          <h4>Contact Us</h4>
          <p>Email: support@pause-cph.com</p>
          <p>Phone: +45 1234 5678</p>
          <p>Address: Copenhagen, Denmark</p>
        </div>
        
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Pause. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
