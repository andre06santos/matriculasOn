import { act, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../ui/button";
import { Modal } from "../../../ui/modal";
import { validateEmptyString } from "../../../modules/formValidationUtils";
import { useAdmin } from "../../../modules/administradores/views/hooks/use-administrador";
import { NotFound } from "../../../ui/not-found";
import { CoursesFilter } from "./filter";
import { Spinner } from "../../../ui/spinner";
import { toast } from "react-toastify";
import { Pagination } from "../../../ui/pagination/pagination";
import "./styles.css";

const ListCourses = () => {
  const { courses, getCourses, searchCourse, deleteCourse } = useAdmin();
  const [page, setPage] = useState(0);
  let actualCourses = courses;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const nameInput = useRef<any>(null);

  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [courseId, setCourseId] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const openModal = (courseId: any) => {
    setIsModalOpen(true);
    setCourseId(courseId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onClean = () => {
    setName("");
    setSearchTerm("");
    setIsSearching(false);
  };

  const onFocus = () => nameInput.current.focus();

  const onReset = () => {
    if (name === "") return;

    onClean();
    onFocus();
    setPage(0);
    getCourses();
    actualCourses = courses;
  };

  const checkFields = () => {
    if (name === "") {
      getCourses();
      onClean();
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await deleteCourse(courseId);
      toast("Curso excluído com sucesso!", {
        position: "top-center",
        type: "success",
      });
      setPage(0);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast("Ocorreu um erro ao tentar excluir o curso!", {
        position: "top-center",
        type: "error",
      });
      console.error((error as Error).message);
    } finally {
      closeModal();
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const emptyField = validateEmptyString(name);

    if (emptyField) {
      toast("Digite um nome para filtrar!", {
        position: "top-center",
        type: "error",
      });
      onClean();
      onFocus();

      return;
    }

    try {
      setIsLoading(true);
      setPage(0);
      const filteredCourses = await searchCourse(name, page);
      actualCourses = filteredCourses;

      setIsSearching(true);
      setIsLoading(false);
      setSearchTerm(name);
    } catch (error) {
      setIsLoading(false);
      toast("Ocorreu um erro ao tentar filtrar curso!", {
        position: "top-center",
        type: "error",
      });
      console.error((error as Error).message);
    }
  };

  useEffect(() => {
    checkFields();
  }, [name]);

  useEffect(() => {
    const changePageFiltered = async () => {
      const newPageFiltered = await searchCourse(name, page);
      actualCourses = newPageFiltered;
    };

    changePageFiltered();
  }, [page]);

  return (
    <div className="flex-column-gap20">
      {isLoading && <Spinner />}

      {isModalOpen && (
        <Modal
          message="Tem certeza que deseja excluir este curso?"
          onCancel={closeModal}
          onDelete={onDelete}
        />
      )}

      <div className="add-button">
        <Link to="/cursos/novo-curso">
          <Button type="success" label="Adicionar" />
        </Link>
      </div>

      <h1>Cursos</h1>

      {actualCourses.content !== undefined &&
      actualCourses.content.length === 0 ? (
        isSearching ? (
          <>
            <CoursesFilter
              onSubmit={onSubmit}
              name={name}
              setName={setName}
              nameInput={nameInput}
              onReset={onReset}
            />
            <NotFound
              message={`A busca por "${searchTerm}" não retornou nenhum curso!`}
            />
          </>
        ) : (
          <NotFound message="Nenhum curso foi encontrado!" />
        )
      ) : (
        <>
          <CoursesFilter
            onSubmit={onSubmit}
            name={name}
            setName={setName}
            nameInput={nameInput}
            onReset={onReset}
          />

          <p>
            {isSearching
              ? `Total de cursos encontrados ao filtrar por "${searchTerm}": `
              : "Total de cursos encontrados: "}
            <span className="courses-quantity">
              {actualCourses.totalElements}
            </span>
          </p>

          <table className="table">
            <thead className="table-header">
              <tr>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {actualCourses.content !== undefined &&
                actualCourses.content.map((course: any, index: any) => (
                  <tr key={index}>
                    <td>{course.nome}</td>
                    <td className="table-actions">
                      <Link to="/cursos/editar-curso" state={course}>
                        <i className="fa-solid fa-pen-to-square icons-action"></i>
                      </Link>
                      <i
                        className="fa-solid fa-trash-can"
                        onClick={() => openModal(course.id)}
                      ></i>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {actualCourses.pageable !== undefined && (
            <Pagination
              pageNumber={actualCourses.pageable.pageNumber}
              pageSize={actualCourses.size}
              totalPages={actualCourses.totalPages}
              last={actualCourses.last}
              first={actualCourses.first}
              setPage={setPage}
              buttonsQnt={2}
            />
          )}
        </>
      )}
    </div>
  );
};

export { ListCourses };
