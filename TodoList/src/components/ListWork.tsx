interface Work {
  id: string;
  name: string;
  status: boolean;
}

interface Works {
  work: Work;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function ListWork({ work, onDelete, onEdit }: Works) {
  return (
    <li
      key={work.id}
      className="list-group-item d-flex align-items-center justify-content-between border-0 mb-2 rounded"
      style={{ backgroundColor: "#f4f6f7" }}
    >
      <div>
        <input className="form-check-input me-2" type="checkbox" />
        <span>{work.name}</span>
      </div>
      <div className="d-flex gap-3">
        <i
          className="fas fa-pen-to-square text-warning"
          onClick={() => onEdit(work.id)}
        />
        <i
          className="far fa-trash-can text-danger"
          onClick={() => onDelete(work.id)}
        />
      </div>
    </li>
  );
}
