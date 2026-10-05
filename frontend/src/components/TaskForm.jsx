import { useState } from "react";

const TaskForm = ({ onCreate }) => {
  const [title, setTitle] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate(title.trim());
    setTitle("");
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <input placeholder="What needs doing?" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
