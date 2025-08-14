import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mainLogo from "../assets/mainLogo.svg";
import styles from "./Splash.module.scss";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.splash}>
      <img src={mainLogo} alt="main Logo" />
    </div>
  );
};

export default Splash;
