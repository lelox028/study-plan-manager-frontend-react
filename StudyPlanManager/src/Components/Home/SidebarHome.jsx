import styles from '../../dist/home.module.scss';

const SidebarHome = ({
  universidades = [],
  activeUni = null,
  activeFacu = null,
  onSelectUniversidad = () => {},
  onSelectFacultad = () => {},
  onDeleteUniversidad = () => {},
  onDeleteFacultad = () => {},
  onAddUniversidad = () => {},
}) => {
  return (
    <div className={styles.SideBar}>
      <div className={styles.SideBarMain}>
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(42, 49, 64, 1)' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>
            Universities
          </h3>
        </div>

        <div className={styles.SideBarMainContent}>
          {(universidades || []).map((universidad) => (
            <div key={universidad.id_Universidad}>
              {/* University Item */}
              <div
                className={`${styles.SideBarItem} ${
                  activeUni?.id_Universidad === universidad.id_Universidad ? styles.active : ''
                }`}
                onClick={() => onSelectUniversidad(universidad)}
              >
                <div className={styles.UiiconContainer}>
                  <span className="material-symbols-outlined">domain</span>
                  <span className={styles.UiName}>{universidad.nombre_Universidad}</span>
                </div>
                <button
                  className={styles.SideBarDeleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      window.confirm(
                        `Delete ${universidad.nombre_Universidad}? This cannot be undone.`
                      )
                    ) {
                      onDeleteUniversidad(universidad.id_Universidad);
                    }
                  }}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Faculty Items - Only show if this university is active */}
              {activeUni?.id_Universidad === universidad.id_Universidad && (
                <div className={styles.SideBarItemContainer}>
                  {(universidad.facultades || []).map((facultad) => (
                    <div
                      key={facultad.id_F}
                      className={`${styles.SideBarItem} ${
                        activeFacu?.id_F === facultad.id_F ? styles.active : ''
                      }`}
                      onClick={() => onSelectFacultad(facultad)}
                    >
                      <div className={styles.UiiconContainer}>
                        <span className="material-symbols-outlined">account_balance</span>
                        <span className={styles.UiName}>{facultad.nombre_F}</span>
                      </div>
                      <button
                        className={styles.SideBarDeleteButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            window.confirm(
                              `Delete ${facultad.nombre_F}? This cannot be undone.`
                            )
                          ) {
                            onDeleteFacultad(facultad.id_F);
                          }
                        }}
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add University Button */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(42, 49, 64, 1)',
            marginTop: '12px',
          }}
        >
          <button
            onClick={onAddUniversidad}
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: '#136dec',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#1f76f0')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#136dec')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              add
            </span>
            <span>New University</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarHome;