import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    id: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
  });

  // Charger les étudiants
  const loadStudents = () => {
    axios
      .get("http://localhost:8080/api/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Erreur de chargement :", err));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Ouvrir le modal pour ajout
  const handleAdd = () => {
    setEditMode(false);
    setCurrentStudent({ id: "", nom: "", prenom: "", dateNaissance: "" });
    setShowModal(true);
  };

  // Ouvrir le modal pour édition
  const handleEdit = (student) => {
    setEditMode(true);
    setCurrentStudent(student);
    setShowModal(true);
  };

  // Supprimer un étudiant
  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
      axios
        .delete(`http://localhost:8080/api/students/${id}`)
        .then(() => loadStudents())
        .catch((err) => console.error("Erreur suppression :", err));
    }
  };

  // Soumettre le formulaire (ajout ou modification)
  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedStudent = {
      ...currentStudent,
      dateNaissance: currentStudent.dateNaissance,
    };

    if (editMode) {
      axios
        .put(
          `http://localhost:8080/api/students/${currentStudent.id}`,
          formattedStudent
        )
        .then(() => {
          loadStudents();
          setShowModal(false);
        })
        .catch((err) => console.error("Erreur modification :", err));
    } else {
      axios
        .post("http://localhost:8080/api/students", formattedStudent)
        .then(() => {
          loadStudents();
          setShowModal(false);
        })
        .catch((err) => console.error("Erreur ajout :", err));
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Gestion des étudiants</h2>
      <Button variant="primary" onClick={handleAdd}>
        + Ajouter un étudiant
      </Button>

      <table className="table table-striped mt-4">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Date de naissance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.nom}</td>
                <td>{student.prenom}</td>
                <td>{student.dateNaissance}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(student)}
                    className="me-2"
                  >
                    ✏️ Modifier
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(student.id)}
                  >
                    🗑️ Supprimer
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Aucun étudiant trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL AJOUT / MODIFICATION */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Modifier l'étudiant" : "Ajouter un étudiant"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nom :</Form.Label>
              <Form.Control
                type="text"
                value={currentStudent.nom}
                onChange={(e) =>
                  setCurrentStudent({ ...currentStudent, nom: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prénom :</Form.Label>
              <Form.Control
                type="text"
                value={currentStudent.prenom}
                onChange={(e) =>
                  setCurrentStudent({ ...currentStudent, prenom: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date de naissance :</Form.Label>
              <Form.Control
                type="date"
                value={
                  currentStudent.dateNaissance
                    ? currentStudent.dateNaissance.split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setCurrentStudent({
                    ...currentStudent,
                    dateNaissance: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="success" type="submit">
              {editMode ? "Mettre à jour" : "Ajouter"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentList;

