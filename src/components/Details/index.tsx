import React, { useState } from 'react';

import styles from '../../styles/components/Details/styles.module.scss';

interface IDetailsProps {
  description: string;
  content: string;
}

const Details: React.FC<IDetailsProps> = ({ description, content }) => {
  const [view, setView] = useState<'info' | 'facebook'>('info');

  return (
    <div className={styles.container}>
      <nav className={styles.navigation}>
        <ul>
          <li
            className={view === 'info' ? styles.active : styles.navItem}
            onClick={() => {
              setView('info');
            }}
          >
            <a data-toggle="tab" href="#home">
              Mais Informações
            </a>
          </li>
          <li
            className={view === 'facebook' ? styles.active : styles.navItem}
            onClick={() => {
              setView('facebook');
            }}
          >
            <a data-toggle="tab" href="#home">
              Avaliação dos Clientes
            </a>
          </li>
        </ul>
      </nav>
      {view === 'info' ? (
        <section className={styles.sectionContainer} id="home">
          <p>{description}</p>
          <div className={styles.contentText}>
            <p>
              <span>Conteúdo:</span>
              {content}
            </p>
          </div>
        </section>
      ) : (
        <section className={styles.sectionContainer} id="fbcomments">
          Fb: comments
        </section>
      )}
    </div>
  );
};

export default Details;
