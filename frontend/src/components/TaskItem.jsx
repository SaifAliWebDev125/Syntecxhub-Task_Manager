const STATUS_CYCLE = { pending: "in-progress", "in-progress": "done", done: "pending" };

const TaskItem = ({ task, onUpdate, onDelete }) => (
  <li className={`task-item status-${task.status}`}>
    <div>
      <strong>{task.title}</strong>
      <span className="badge">{task.status}</span>
    </div>
    <div className="task-actions">
      {/* Clicking the status cycles it — no dropdown needed for a 3-state field */}
      <button onClick={() => onUpdate(task._id, { status: STATUS_CYCLE[task.status] })}>
        Advance
      </button>
      <button onClick={() => onDelete(task._id)}>Delete</button>
    </div>
  </li>
);

export default TaskItem;
