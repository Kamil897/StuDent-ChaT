import styles from './Clouds.module.scss';

const Clouds = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>
        Добро пожаловать 
      </h1>
      <svg className={styles.svg} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="Gradient1" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
            <animate attributeName="fx" dur="34s" values="0%;3%;0%" repeatCount="indefinite" />
            <stop offset="0%" stopColor="#ff0" />
            <stop offset="100%" stopColor="#ff00" />
          </radialGradient>
          <radialGradient id="Gradient2" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
            <animate attributeName="fx" dur="23.5s" values="0%;3%;0%" repeatCount="indefinite" />
            <stop offset="0%" stopColor="#0ff" />
            <stop offset="100%" stopColor="#0ff0" />
          </radialGradient>
          <radialGradient id="Gradient3" cx="50%" cy="50%" fx="50%" fy="50%" r=".5">
            <animate attributeName="fx" dur="21.5s" values="0%;3%;0%" repeatCount="indefinite" />
            <stop offset="0%" stopColor="#f0f" />
            <stop offset="100%" stopColor="#f0f0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient1)">
          <animate attributeName="x" dur="20s" values="25%;0%;25%" repeatCount="indefinite" />
          <animate attributeName="y" dur="21s" values="0%;25%;0%" repeatCount="indefinite" />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="17s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient2)">
          <animate attributeName="x" dur="23s" values="-25%;0%;-25%" repeatCount="indefinite" />
          <animate attributeName="y" dur="24s" values="0%;50%;0%" repeatCount="indefinite" />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="18s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient3)">
          <animate attributeName="x" dur="25s" values="0%;25%;0%" repeatCount="indefinite" />
          <animate attributeName="y" dur="26s" values="0%;25%;0%" repeatCount="indefinite" />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="360 50 50"
            to="0 50 50"
            dur="19s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
  );
};

export default Clouds;
