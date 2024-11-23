import styled from "styled-components";
import { staticImages } from "../../utils/images";
import { Link } from "react-router-dom";
import { defaultTheme } from "../../styles/themes/default";

const SignOptions = styled.div`
  row-gap: 12px;

  .sign-option {
    column-gap: 12px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid ${defaultTheme.color_platinum};
    transition: ${defaultTheme.default_transition};

    &:hover {
      transform: translateY(-2px); /* subtle lift effect */
      background-color: #FFFAF0; 
      border-color: #000000; /* muted soft brown for border */
      color: #3C3C3C; /* dark text to ensure readability */
    }

    .sign-opt-icon {
      img {
        width: 18px;
      }
    }
  }
`;

const AuthOptions = ({ handleGoogleSignUp }) => {
  return (
    <SignOptions className="grid">
      <div onClick={handleGoogleSignUp} className="sign-option flex items-center justify-center">
        <span className="sign-opt-icon flex items-center justify-center">
          <img src={staticImages.google} />
        </span>
        <span className="sign-opt-text font-medium">Continue With Google</span>
      </div>
    </SignOptions>
  );
};

export default AuthOptions;