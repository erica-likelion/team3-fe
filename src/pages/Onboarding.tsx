import wearyOngil from "../assets/wearyOngil.svg";
import styles from "./Onboarding.module.scss";

const Onboarding: React.FC = () => {
  return (
    <div className={styles.onboarding}>
      <div className={styles.content}>
        <h1>온보딩 페이지입니다</h1>
        <img src={wearyOngil} alt="Ongil Logo" className={styles.logo} />
      </div>
    </div>
  );
};

export default Onboarding;
