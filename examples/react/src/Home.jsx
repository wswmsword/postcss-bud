import styles from "./Home.module.css";

const Hello = () => {
  const box = `.box {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(48, 48, 48);
  border-radius: 12px;
  width: 588px;
  height: 388px;
}`;
  const list = `.list {
  position: absolute;
  width: 746px;
  height: 1036px;
  border-radius: 12px;
  background-color: white;
  left: 22px;
  top: 22px;
  padding-top: 181px;
  box-sizing: border-box;
  overflow: hidden;
}`;
  return <div className={styles.appInnerRoot}>
    <div className={styles.list}>
      <div className={styles.listcode}>
        <pre><code>{list}</code></pre>
      </div>
      <h1 className={styles.bud}>PostCSS Bud</h1>
      <div className={styles.card}></div>
      <div className={styles.card}></div>
      <div className={styles.card}></div>
    </div>
    <div className={styles.box}>
      <div className={styles.boxcode}>
        <pre><code>{box}</code></pre>
      </div>
    </div>
  </div>
};

export default Hello;