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
              src="https://images.unsplash.com/photo-1624561172888-ac93c696e10c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
              alt=""
              className="avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
