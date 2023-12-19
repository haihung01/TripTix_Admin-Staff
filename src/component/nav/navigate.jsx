import SmsIcon from '@mui/icons-material/Sms';
import "./navigate.scss";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const facebookMessagingLink = "https://www.facebook.com/messages/t";

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="items">
          <div className="item">
            <Link to={facebookMessagingLink} target="_blank" rel="noopener noreferrer">
              <SmsIcon className="icon" />
            </Link>
            <div className="counter">1</div>
          </div>
          <div className="item">
            <img
              src="https://icon-library.com/images/admin-icon-png/admin-icon-png-16.jpg"
              alt="hinh"
              className="avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
