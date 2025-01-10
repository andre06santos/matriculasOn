import { createContext, useCallback, useMemo, useState } from "react";
import { fetchData } from "../infrastructure/fetch-data";

export const AdminContext = createContext<any>(undefined);

export const AdminProvider = ({ children }: any) => {
  const [admins, setAdmins] = useState<any>([]);
  const [courses, setCourses] = useState<any>([]);
  const [students, setStudents] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [permissions, setPermissions] = useState<any>([]);

  const getCourses = useCallback(async () => {
    try {
      const userRequest = {
        endpoint: `/cursos`,
      };
      const _courses = await fetchData(userRequest);

      setCourses(_courses);
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const searchCourse = useCallback(async (name: any, page: number) => {
    try {
      const userRequest = {
        endpoint: `/cursos?nome=${name}&page=${page}`,
      };
      const _courses = await fetchData(userRequest);

      setCourses(_courses);
      return _courses;
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const searchStudent = useCallback(
    async (name: any, cpf: any, matricula: any) => {
      try {
        const queryParams = new URLSearchParams();

        if (name) {
          queryParams.append("nome", name.trim());
        }
        if (matricula) {
          queryParams.append("matricula", matricula.trim());
        }
        if (cpf) {
          queryParams.append("cpf", cpf.trim());
        }

        const endpoint = `/alunos?${queryParams.toString()}`;
        const userRequest = { endpoint };
        const _students = await fetchData(userRequest);

        setStudents(_students);
      } catch (error) {
        console.error((error as Error).message);
        throw new Error((error as Error).message);
      }
    },
    []
  );

  const searchUser = useCallback(
    async (username: any, name: any, status: any) => {
      try {
        const queryParams = new URLSearchParams();

        if (username) {
          queryParams.append("username", username.trim());
        }
        if (name) {
          queryParams.append("nome", name.trim());
        }
        if (status) {
          queryParams.append("status", status);
        }
        const endpoint = `/usuarios?${queryParams.toString()}`;
        const userRequest = { endpoint };
        const _users = await fetchData(userRequest);

        setUsers(_users);
      } catch (error) {
        console.error((error as Error).message);
        throw new Error((error as Error).message);
      }
    },
    []
  );

  const addCourse = useCallback(async (newCourse: any) => {
    try {
      const userRequest = {
        endpoint: "/cursos",
        config: {
          method: "POST",
          data: JSON.stringify(newCourse),
        },
      };

      const addedCourse = await fetchData(userRequest);

      getCourses();

      return addedCourse;
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const editCourse = useCallback(async ({ id, newCourse }: any) => {
    try {
      const userRequest = {
        endpoint: `/cursos/${id}`,
        config: {
          method: "PUT",
          data: JSON.stringify(newCourse),
        },
      };

      const editedCourse = await fetchData(userRequest);

      setCourses((prevCourses: any) => [...prevCourses, editedCourse]);

      return editedCourse;
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const deleteCourse = useCallback(async (id: any) => {
    try {
      const userRequest = {
        endpoint: `/cursos/${id}`,
        config: {
          method: "DELETE",
        },
      };

      const courseDeleted = await fetchData(userRequest);

      getCourses();

      return courseDeleted;
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const editStudent = useCallback(async ({ id, newStudent }: any) => {
    try {
      const userRequest = {
        endpoint: `/alunos/${id}`,
        config: {
          method: "PUT",
          data: JSON.stringify(newStudent),
        },
      };
      const editedStudent = await fetchData(userRequest);

      setStudents((prevStudent: any) => [...prevStudent, editedStudent]);

      return editedStudent;
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const getStudent = useCallback(async () => {
    try {
      const userRequest = {
        endpoint: "/alunos",
        config: {
          method: "GET",
        },
      };
      const _students = await fetchData(userRequest);

      setStudents(_students);
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const addStudents = useCallback(async (newStudent: any) => {
    try {
      const userRequest = {
        endpoint: "/alunos",
        config: {
          method: "POST",
          data: JSON.stringify(newStudent),
        },
      };

      const addedStudent = await fetchData(userRequest);

      setStudents((prevStudent: any) => [...prevStudent, addedStudent]);
      return addedStudent;
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);
  const deleteStudent = useCallback(async (id: any) => {
    try {
      const userRequest = {
        endpoint: `/alunos/${id}`,
        config: {
          method: "DELETE",
        },
      };

      const studentDeleted = await fetchData(userRequest);

      setStudents((prevStudent: any) =>
        prevStudent.filter((student: any) => student.id !== id)
      );

      return studentDeleted;
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const getUsers = useCallback(async () => {
    try {
      const userRequest = {
        endpoint: "/usuarios",
        config: {
          method: "GET",
        },
      };

      const _users = await fetchData(userRequest);

      setUsers(_users);
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const addAdmin = useCallback(async (newAdmin: any) => {
    try {
      const userRequest = {
        endpoint: "/usuarios",
        config: {
          method: "POST",
          data: JSON.stringify(newAdmin),
        },
      };

      const addedAdmin = await fetchData(userRequest);

      setAdmins((prevAdmin: any) => [...prevAdmin, addedAdmin]);

      return addAdmin;
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const deleteAdmin = useCallback(async (id: any) => {
    try {
      const userRequest = {
        endpoint: `/usuarios/${id}`,
        config: {
          method: "DELETE",
        },
      };
      const adminDeleted = await fetchData(userRequest);

      setAdmins((prevAdmin: any) =>
        prevAdmin.filter((admin: any) => admin.id !== id)
      );
      return adminDeleted;
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const deleteUser = useCallback(async (id: any) => {
    try {
      const userRequest = {
        endpoint: `/usuarios/${id}`,
        config: {
          method: "DELETE",
        },
      };
      const userDeleted = await fetchData(userRequest);

      setUsers((prevUser: any) =>
        prevUser.filter((user: any) => user.id !== id)
      );

      return userDeleted;
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const editAdmin = useCallback(async ({ id, newAdmin }: any) => {
    try {
      const userRequest = {
        endpoint: `/usuarios/${id}`,
        config: {
          method: "PUT",
          data: JSON.stringify(newAdmin),
        },
      };
      const editedAdmin = await fetchData(userRequest);

      setAdmins((prevadmin: any) => [...prevadmin, editedAdmin]);

      return editedAdmin;
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const getPermissions = useCallback(async () => {
    try {
      const userRequest = {
        endpoint: "permissoes",
        config: {
          method: "GET",
        },
      };

      const _permissions = await fetchData(userRequest);
      setPermissions(_permissions);
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const addPermission = useCallback(async (newPermission: any) => {
    try {
      const userRequest = {
        endpoint: "/permissoes",
        config: {
          method: "POST",
          data: JSON.stringify(newPermission),
        },
      };

      const addedPermission = await fetchData(userRequest);

      setPermissions((prevPermissions: any) => [
        ...prevPermissions,
        addedPermission,
      ]);
      return addedPermission;
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const searchPermission = useCallback(async (descricao: any) => {
    try {
      const userRequest = {
        endpoint: `/permissoes?descricao=${descricao}`,
      };

      const _permissions = await fetchData(userRequest);

      setPermissions(_permissions);
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const editPermission = useCallback(async ({ id, newPermission }: any) => {
    try {
      const userRequest = {
        endpoint: `/permissoes/${id}`,
        config: {
          method: "PUT",
          data: JSON.stringify(newPermission),
        },
      };

      const editedPermission = await fetchData(userRequest);

      setPermissions((prevPermissions: any) => [
        ...prevPermissions,
        editedPermission,
      ]);

      return editedPermission;
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const deletePermission = useCallback(async (id: any) => {
    try {
      const userRequest = {
        endpoint: `permissoes/${id}`,
        config: {
          method: "DELETE",
        },
      };

      const deletedPermission = await fetchData(userRequest);
      setPermissions((prevPermissions: any) =>
        prevPermissions.filter((permission: any) => permission.id !== id)
      );
      return deletedPermission;
    } catch (error) {
      console.error((error as Error).message);
      throw new Error((error as Error).message);
    }
  }, []);

  const value = useMemo(
    () => ({
      admins,
      addAdmin,
      editAdmin,
      deleteAdmin,
      users,
      getUsers,
      deleteUser,
      searchUser,
      students,
      editStudent,
      searchStudent,
      getStudent,
      addStudents,
      deleteStudent,
      courses,
      addCourse,
      editCourse,
      getCourses,
      searchCourse,
      deleteCourse,
      permissions,
      addPermission,
      getPermissions,
      searchPermission,
      editPermission,
      deletePermission,
    }),
    [
      admins,
      addAdmin,
      editAdmin,
      deleteAdmin,
      users,
      getUsers,
      deleteUser,
      searchUser,
      students,
      editStudent,
      searchStudent,
      students,
      getStudent,
      courses,
      addStudents,
      addCourse,
      editCourse,
      getCourses,
      searchCourse,
      deleteCourse,
      permissions,
      getPermissions,
      addPermission,
      searchPermission,
      editPermission,
      deletePermission,
    ]
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
