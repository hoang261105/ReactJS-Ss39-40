import React, { useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ListWork from "./ListWork";

interface Work {
  id: string;
  name: string;
  status: boolean;
}

export default function AddWork() {
  const [value, setValue] = useState<string>("");
  const [inputError, setInputError] = useState<boolean>(false);
  const [worm, setWorm] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Lấy dữ liệu từ local
  const getWork = localStorage.getItem("listWork");

  // Tạo 1 giá trị khởi tạo initial
  const initial = {
    works: getWork ? JSON.parse(getWork) : [],
    inputValue: "",
  };

  // Lưu dữ liệu lên local
  const saveToLocal = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const reducer = (state = initial, action: any) => {
    switch (action.type) {
      case "CHANGE":
        return { ...state, inputValue: action.payload };

      case "ADD":
        let work: Work = {
          id: uuidv4(),
          name: action.payload,
          status: false,
        };

        const newWorks = [...state.works, work];
        saveToLocal("listWork", newWorks);
        setValue("");
        setEditId(null);

        return {
          ...state,
          works: newWorks,
          inputValue: "",
        };
      case "DELETE":
        const newWorksAfterDelete = state.works.filter(
          (work: Work) => work.id !== action.payload
        );
        saveToLocal("listWork", newWorksAfterDelete);

        return {
          ...state,
          works: newWorksAfterDelete,
        };
      case "EDIT":
        const newWorksAfterEdit = state.works.map((work: Work) =>
          work.id === action.payload.id
            ? { ...work, name: action.payload.name }
            : work
        );
        saveToLocal("listWork", newWorksAfterEdit);
        return {
          ...state,
          works: newWorksAfterEdit,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initial);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    dispatch(action("CHANGE", e.target.value));
  };

  // Hàm thêm công việc
  const handleAdd = (e: any) => {
    e.preventDefault();

    if (!value) {
      setInputError(true);
    } else {
      setInputError(false);
      const checkName = state.works.find((work: Work) => work.name === value);
      if (checkName && !editId) {
        setWorm(true);
      } else {
        setWorm(false);
        if (editId) {
          dispatch(action("EDIT", { id: editId, name: value }));
        } else {
          dispatch(action("ADD", value));
        }
        setValue("");
        setEditId(null);
      }
    }
  };

  const handleDelete = (id: string) => {
    const confirmDel = confirm(
      `Ban có chắc chắn muốn xóa công việc này không?`
    );
    if (confirmDel) {
      dispatch(action("DELETE", id));
    }
  };

  // Hàm sửa
  const handleEdit = (id: string) => {
    const work = state.works.find((work: Work) => work.id === id);
    if (work) {
      setValue(work.name);
      setEditId(work.id);
    }
  };

  const action = (type: string, payload: any) => {
    return { type, payload };
  };

  const closeModal = () => {
    setInputError(false);
    setWorm(false);
  };

  return (
    <div>
      <form
        className="d-flex justify-content-center align-items-center mb-4"
        onSubmit={handleAdd}
      >
        <div className="form-outline flex-fill">
          <input
            value={value}
            type="text"
            id="form2"
            className="form-control"
            onChange={handleChange}
          />
          <label className="form-label" htmlFor="form2">
            Nhập tên công việc
          </label>
        </div>
        <button type="submit" className="btn btn-info ms-2">
          {editId ? "Sửa" : "Thêm"}
        </button>
      </form>
      <ul className="nav nav-tabs mb-4 pb-2">
        <li className="nav-item" role="presentation">
          <a className="nav-link active">Tất cả</a>
        </li>
        <li className="nav-item" role="presentation">
          <a className="nav-link">Đã hoàn thành</a>
        </li>
        <li className="nav-item" role="presentation">
          <a className="nav-link">Chưa hoàn thành</a>
        </li>
      </ul>
      <div className="tab-content" id="ex1-content">
        <div className="tab-pane fade show active">
          <ul className="list-group mb-0">
            {state.works.map((work: Work) => (
              <ListWork
                key={work.id}
                work={work}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </ul>
        </div>
      </div>
      {/* Modal xác nhận xóa */}
      {inputError && (
        <div className="overlay">
          <div className="modal-custom">
            <div className="modal-header-custom">
              <h5>Cảnh báo</h5>
              <i className="fas fa-xmark" onClick={closeModal} />
            </div>
            <div className="modal-body-custom">
              <p>Tên công việc không được phép để trống.</p>
            </div>
            <div className="modal-footer-footer">
              <button className="btn btn-light" onClick={closeModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {worm && (
        <div className="overlay">
          <div className="modal-custom">
            <div className="modal-header-custom">
              <h5>Cảnh báo</h5>
              <i className="fas fa-xmark" onClick={closeModal} />
            </div>
            <div className="modal-body-custom">
              <p>Tên công việc không được trùng.</p>
            </div>
            <div className="modal-footer-footer">
              <button className="btn btn-light" onClick={closeModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
