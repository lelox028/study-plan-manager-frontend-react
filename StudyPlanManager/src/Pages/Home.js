import styles from '../dist/home.module.scss';
import { Container, TextField, Button } from '@mui/material';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import TopBar from '../Components/TopBar';
import SidebarHome from '../Components/Home/SidebarHome';


function Home() {
  const [universidades, setUniversidades] = React.useState([]);
  const [activeUni, setActiveUni] = React.useState(null);
  const [activeFacu, setActiveFacu] = React.useState(null);

  const [isAddingFacultad, setIsAddingFacultad] = React.useState(false);
  const [isAddingCarrera, setIsAddingCarrera] = React.useState(false);
  const [isAddingUniversidad, setIsAddingUniversidad] = React.useState(false);

  const [editingFacultadId, setEditingFacultadId] = React.useState(null);
  const [editingFacultadName, setEditingFacultadName] = React.useState('');
  const [editingCarreraId, setEditingCarreraId] = React.useState(null);
  const [editingCarreraNombre, setEditingCarreraNombre] = React.useState('');
  const [editingCarreraDuracion, setEditingCarreraDuracion] = React.useState('');
  const [editingCarreraTituloIntermedio, setEditingCarreraTituloIntermedio] = React.useState('');

  const [newFacultadName, setNewFacultadName] = React.useState('');
  const [newCarreraNombre, setNewCarreraNombre] = React.useState('');
  const [newCarreraDuracion, setNewCarreraDuracion] = React.useState('');
  const [newCarreraTituloIntermedio, setNewCarreraTituloIntermedio] = React.useState('');
  const [newUniversidadName, setNewUniversidadName] = React.useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  /* ===== API CALLS ===== */

  const loadUniversidades = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/universidades`)
      .then((response) => {
        const universidadesData = response.data || [];
        setUniversidades(universidadesData);
        activeUni && setActiveUni(universidadesData.find((u) => u.id_Universidad === activeUni?.id_Universidad) || null);
        activeFacu && setActiveFacu(universidadesData.find((u) => u.id_Universidad === activeUni?.id_Universidad)?.facultades?.find((f) => f.id_F === activeFacu?.id_F) || null);
        console.log('Updated active university and faculty based on latest data', activeUni, activeFacu);
      })
      .catch((error) => {
        console.error('Error loading universities:', error);
      });
  };

  const createUniversidad = (nombre) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/universidades`, {
        nombre_Universidad: nombre,
      })
      .then(() => {
        loadUniversidades();
        setNewUniversidadName('');
        setIsAddingUniversidad(false);
      })
      .catch((error) => {
        console.error('Error creating university:', error);
      });
  };

  const createFacultad = (nombre) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/facultades`, {
        nombreF: nombre,
        universidad: activeUni,
      })
      .then(() => {
        loadUniversidades();
        setNewFacultadName('');
        setIsAddingFacultad(false);
      })
      .catch((error) => {
        console.error('Error creating faculty:', error);
      });
  };

  const createCarrera = (carrera) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/carreras`, carrera)
      .then(() => {
        loadUniversidades();
        setNewCarreraNombre('');
        setNewCarreraDuracion('');
        setNewCarreraTituloIntermedio('');
        setIsAddingCarrera(false);
      })
      .catch((error) => {
        console.error('Error creating career:', error);
      });
  };

  const deleteUniversidad = (id) => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/universidades/${id}`)
      .then(() => {
        loadUniversidades();
        if (activeUni?.id_Universidad === id) setActiveUni(null);
      })
      .catch((error) => {
        console.error('Error deleting university:', error);
      });
  };

  const deleteFacultad = (id) => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/facultades/${id}`)
      .then(() => {
        loadUniversidades();
        if (activeFacu?.id_F === id) setActiveFacu(null);
      })
      .catch((error) => {
        console.error('Error deleting faculty:', error);
      });
  };

  const deleteCarrera = (id) => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/carreras/${id}`)
      .then(() => {
        loadUniversidades();
      })
      .catch((error) => {
        console.error('Error deleting career:', error);
      });
  };

  /* ===== HANDLERS ===== */

  const handleSelectUniversidad = (uni) => {
    setActiveUni(uni);
    setActiveFacu(null);
  };

  const handleSelectFacultad = (facu) => {
    setActiveFacu(facu);
  };

  const handleSaveUniversidad = () => {
    if (newUniversidadName.trim()) {
      createUniversidad(newUniversidadName);
    }
  };

  const handleSaveFacultad = () => {
    if (newFacultadName.trim()) {
      createFacultad(newFacultadName);
    }
  };

  const handleSaveCarrera = () => {
    if (newCarreraNombre.trim() && newCarreraDuracion) {
      createCarrera({
        nombreC: newCarreraNombre,
        duracion: parseInt(newCarreraDuracion),
        tituloIntermedio: newCarreraTituloIntermedio.trim() || null,
        fechaInscripcion: new Date(),
        facultad: activeFacu,
      });
    }
  };

  const handleDelete = (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'universidad') deleteUniversidad(id);
      else if (type === 'facultad') deleteFacultad(id);
      else if (type === 'carrera') deleteCarrera(id);
    }
  };

  const handleNavigateToCarrera = (carreraId) => {
    navigate(`/carrera/${carreraId}`);
  };

  const handleStartEditFacultad = (faculty) => {
    setEditingFacultadId(faculty.id_F);
    setEditingFacultadName(faculty.nombre_F);
  };

  const handleCancelEditFacultad = () => {
    setEditingFacultadId(null);
    setEditingFacultadName('');
  };

  const handleSaveEditFacultad = () => {
    if (editingFacultadName.trim()) {
      axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/facultades/${editingFacultadId}`, {
          nombreF: editingFacultadName,
        })
        .then(() => {
          loadUniversidades();
          handleCancelEditFacultad();
        })
        .catch((error) => {
          console.error('Error updating faculty:', error);
        });
    }
  };

  const handleStartEditCarrera = (career) => {
    setEditingCarreraId(career.id_C);
    setEditingCarreraNombre(career.nombreC);
    setEditingCarreraDuracion(career.duracion.toString());
    setEditingCarreraTituloIntermedio(career.tituloIntermedio || '');
  };

  const handleCancelEditCarrera = () => {
    setEditingCarreraId(null);
    setEditingCarreraNombre('');
    setEditingCarreraDuracion('');
    setEditingCarreraTituloIntermedio('');
  };

  const handleSaveEditCarrera = () => {
    if (editingCarreraNombre.trim() && editingCarreraDuracion) {
      axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/carreras/${editingCarreraId}`, {
          nombreC: editingCarreraNombre,
          duracion: parseInt(editingCarreraDuracion),
          tituloIntermedio: editingCarreraTituloIntermedio.trim() || null,
        })
        .then(() => {
          loadUniversidades();
          handleCancelEditCarrera();
        })
        .catch((error) => {
          console.error('Error updating career:', error);
        });
    }
  };

  /* ===== HELPERS ===== */

  const getColorForFaculty = (name, index) => {
    const colors = ['#136dec', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4'];
    return colors[(index || 0) % colors.length];
  };

  /* ===== USE EFFECTS ===== */

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    loadUniversidades();
  }, []);

  /* ===== MAIN CONTENT RENDERING ===== */

  const renderMainContent = () => {
    // Show university creation form
    if (isAddingUniversidad) {
      return (
        <div className={styles.MainWrapper}>
          <div className={styles.MainHeader}>
            <div className={styles.HeaderLeft}>
              <h1 className={styles.MainTitle}>Create University</h1>
              <p className={styles.MainDescription}>
                Add a new university to your study plan management system.
              </p>
            </div>
          </div>

          <div className={styles.FormContainer} style={{ maxWidth: '500px', margin: '32px 0' }}>
            <div className={styles.FormGroup}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#e2e8f0', fontWeight: 500 }}>
                University Name
              </label>
              <TextField
                fullWidth
                placeholder="e.g., Universidad Nacional Autónoma de México"
                value={newUniversidadName}
                onChange={(e) => setNewUniversidadName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveUniversidad()}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <Button variant="contained" onClick={handleSaveUniversidad}>
                  Create University
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setNewUniversidadName('');
                    setIsAddingUniversidad(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // No university selected
    if (!activeUni) {
      return (
        <div className={styles.EmptyState}>
          <h2>Select a University</h2>
          <p>Choose a university from the sidebar to get started</p>
        </div>
      );
    }

    // University selected but no faculty selected -> show faculties
    if (!activeFacu) {
      return renderFacultiesView();
    }

    // Faculty selected -> show careers
    return renderCareersView();
  };

  const renderFacultiesView = () => {
    const faculties = activeUni?.facultades || [];

    return (
      <div className={styles.MainWrapper}>
        {/* Header Section */}
        <div className={styles.MainHeader}>
          <div className={styles.HeaderLeft}>
            <div className={styles.Breadcrumb}>
              <span>University</span>
              <span>{activeUni?.nombre_Universidad}</span>
            </div>
            <h1 className={styles.MainTitle}>Faculties</h1>
            <p className={styles.MainDescription}>
              Manage and organize the academic departments and administrative units within the university.
            </p>
          </div>
          <button
            className={styles.AddButton}
            onClick={() => setIsAddingFacultad(true)}
          >
            <span className="material-symbols-outlined">add</span>
            <span>Add New Faculty</span>
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.TabsContainer}>
          <button className={`${styles.Tab} ${styles.active}`}>
            <span className="material-symbols-outlined">account_balance</span>
            <span>Faculties</span>
            <span className={styles.TabBadge}>{faculties.length}</span>
          </button>
        </div>

        {/* Grid */}
        <div className={styles.Grid}>
          {faculties.map((faculty, idx) => {
            const isEditing = editingFacultadId === faculty.id_F;

            if (isEditing) {
              return (
                <div key={faculty.id_F} className={styles.Card}>
                  <div
                    className={styles.CardHeader}
                    style={{ backgroundColor: getColorForFaculty(faculty.nombre_F, idx) }}
                  >
                    <span className={`material-symbols-outlined ${styles.CardIcon}`}>
                      account_balance
                    </span>
                  </div>
                  <div className={styles.CardBody}>
                    <div className={styles.CardFormGroup}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Faculty name"
                        value={editingFacultadName}
                        onChange={(e) => setEditingFacultadName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEditFacultad()}
                        autoFocus
                      />
                      <div className={styles.CardFormActions}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleSaveEditFacultad}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleCancelEditFacultad}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={faculty.id_F}
                className={styles.Card}
                onClick={() => handleSelectFacultad(faculty)}
              >
                <div
                  className={styles.CardHeader}
                  style={{ backgroundColor: getColorForFaculty(faculty.nombre_F, idx) }}
                >
                  <span className={`material-symbols-outlined ${styles.CardIcon}`}>
                    account_balance
                  </span>
                  <div className={styles.CardActions}>
                    <button
                      className={`${styles.CardActionButton}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEditFacultad(faculty);
                      }}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      className={`${styles.CardActionButton} ${styles.delete}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete('facultad', faculty.id_F);
                      }}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
                <div className={styles.CardBody}>
                  <h3 className={styles.CardTitle}>{faculty.nombre_F}</h3>
                  <p className={styles.CardSubtitle}>Faculty of the university</p>
                </div>
                <div className={styles.CardFooter}>
                  <div className={styles.FooterLeft}>
                    <span className="material-symbols-outlined">school</span>
                    <span>{faculty.carreras?.length || 0} Careers</span>
                  </div>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            );
          })}

          {/* Add Faculty Card */}
          {isAddingFacultad ? (
            <div className={styles.Card}>
              <div className={styles.CardHeader} style={{ backgroundColor: '#3b82f6' }}>
                <span className={`material-symbols-outlined ${styles.CardIcon}`}>
                  add
                </span>
              </div>
              <div className={styles.CardBody}>
                <div className={styles.CardFormGroup}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Faculty name"
                    value={newFacultadName}
                    onChange={(e) => setNewFacultadName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveFacultad()}
                    autoFocus
                  />
                  <div className={styles.CardFormActions}>
                    <Button variant="contained" size="small" onClick={handleSaveFacultad}>
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setNewFacultadName('');
                        setIsAddingFacultad(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={styles.AddCard}
              onClick={() => setIsAddingFacultad(true)}
            >
              <div className={styles.AddCardIcon}>
                <span className="material-symbols-outlined">add</span>
              </div>
              <p className={styles.AddCardText}>Add New Faculty</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCareersView = () => {
    const careers = activeFacu?.carreras || [];

    return (
      <div className={styles.MainWrapper}>
        {/* Header Section */}
        <div className={styles.MainHeader}>
          <div className={styles.HeaderLeft}>
            <div className={styles.Breadcrumb}>
              <span>{activeUni?.nombre_Universidad}</span>
              <span>{activeFacu?.nombre_F}</span>
            </div>
            <h1 className={styles.MainTitle}>Careers</h1>
            <p className={styles.MainDescription}>
              Manage academic programs and career paths within {activeFacu?.nombre_F}.
            </p>
          </div>
          <button
            className={styles.AddButton}
            onClick={() => setIsAddingCarrera(true)}
          >
            <span className="material-symbols-outlined">add</span>
            <span>Add New Career</span>
          </button>
        </div>

        {/* Grid */}
        <div className={styles.Grid}>
          {careers.map((career, idx) => {
            const isEditing = editingCarreraId === career.id_C;

            if (isEditing) {
              return (
                <div key={career.id_C} className={styles.Card}>
                  <div
                    className={styles.CardHeader}
                    style={{
                      backgroundColor: getColorForFaculty(activeFacu?.nombre_F, 0),
                    }}
                  >
                    <span className={`material-symbols-outlined ${styles.CardIcon}`}>
                      school
                    </span>
                  </div>
                  <div className={styles.CardBody}>
                    <div className={styles.CardFormGroup}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Career name"
                        value={editingCarreraNombre}
                        onChange={(e) => setEditingCarreraNombre(e.target.value)}
                        autoFocus
                      />
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        placeholder="Duration (years)"
                        value={editingCarreraDuracion}
                        onChange={(e) => setEditingCarreraDuracion(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Intermediate degree (optional)"
                        value={editingCarreraTituloIntermedio}
                        onChange={(e) => setEditingCarreraTituloIntermedio(e.target.value)}
                      />
                      <div className={styles.CardFormActions}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleSaveEditCarrera}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleCancelEditCarrera}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={career.id_C}
                className={styles.Card}
                onClick={() => handleNavigateToCarrera(career.id_C)}
              >
                <div
                  className={styles.CardHeader}
                  style={{
                    backgroundColor: getColorForFaculty(activeFacu?.nombre_F, 0),
                  }}
                >
                  <span className={`material-symbols-outlined ${styles.CardIcon}`}>
                    school
                  </span>
                  <div className={styles.CardActions}>
                    <button
                      className={`${styles.CardActionButton}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEditCarrera(career);
                      }}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      className={`${styles.CardActionButton} ${styles.delete}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete('carrera', career.id_C);
                      }}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
                <div className={styles.CardBody}>
                  <h3 className={styles.CardTitle}>{career.nombreC}</h3>
                  <div className={styles.CardContent}>
                    <p className={styles.meta}>
                      <span className="material-symbols-outlined">schedule</span>
                      <span>{career.duracion} years</span>
                    </p>
                    {career.tituloIntermedio && (
                      <p className={styles.meta}>
                        <span className="material-symbols-outlined">verified</span>
                        <span>{career.tituloIntermedio}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className={styles.CardFooter}>
                  <div className={styles.CompletionInfo}>
                    <span className={styles.Label}>Progress</span>
                    <span className={styles.Percentage}>65%</span>
                  </div>
                  <div className={styles.ProgressBar}>
                    <div className={styles.Progress} style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Career Card */}
          {isAddingCarrera ? (
            <div className={styles.Card}>
              <div
                className={styles.CardHeader}
                style={{
                  backgroundColor: getColorForFaculty(activeFacu?.nombre_F, 0),
                }}
              >
                <span className={`material-symbols-outlined ${styles.CardIcon}`}>
                  add
                </span>
              </div>
              <div className={styles.CardBody}>
                <div className={styles.CardFormGroup}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Career name"
                    value={newCarreraNombre}
                    onChange={(e) => setNewCarreraNombre(e.target.value)}
                    autoFocus
                  />
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    placeholder="Duration (years)"
                    value={newCarreraDuracion}
                    onChange={(e) => setNewCarreraDuracion(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Intermediate degree (optional)"
                    value={newCarreraTituloIntermedio}
                    onChange={(e) => setNewCarreraTituloIntermedio(e.target.value)}
                  />
                  <div className={styles.CardFormActions}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSaveCarrera}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setNewCarreraNombre('');
                        setNewCarreraDuracion('');
                        setNewCarreraTituloIntermedio('');
                        setIsAddingCarrera(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={styles.AddCard}
              onClick={() => setIsAddingCarrera(true)}
            >
              <div className={styles.AddCardIcon}>
                <span className="material-symbols-outlined">add</span>
              </div>
              <p className={styles.AddCardText}>Add New Career</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.Body}>
      <TopBar user={user} />
      <Container maxWidth="xl" className={styles.Container}>
        <SidebarHome
          universidades={universidades}
          activeUni={activeUni}
          activeFacu={activeFacu}
          onSelectUniversidad={handleSelectUniversidad}
          onSelectFacultad={handleSelectFacultad}
          onDeleteUniversidad={(id) => handleDelete('universidad', id)}
          onDeleteFacultad={(id) => handleDelete('facultad', id)}
          onAddUniversidad={() => setIsAddingUniversidad(true)}
        />
        <div className={styles.Main}>
          {renderMainContent()}
        </div>
      </Container>
    </div>
  );
}

export default Home;