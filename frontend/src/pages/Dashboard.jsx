import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../hooks/useAuth.js";
import TaskForm from "../components/TaskForm.jsx";
import TaskItem from "../components/TaskItem.jsx";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  const fetchTasks = async () => {
    const { data } = await api.get("/tasks");
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (title) => {
    const { data } = await api.post("/tasks", { title });
    setTasks((prev) => [data, ...prev]); // optimistic prepend, no full refetch
  };

  const updateTask = async (id, updates) => {
    const prev = tasks;
    setTasks((t) => t.map((task) => (task._id === id ? { ...task, ...updates } : task))); // optimistic
    try {
      await api.put(`/tasks/${id}`, updates);
    } catch {
      setTasks(prev); // roll back on failure
    }
  };

  const deleteTask = async (id) => {
    const prev = tasks;
    setTasks((t) => t.filter((task) => task._id !== id));
    try {
      await api.delete(`/tasks/${id}`);
    } catch {
      setTasks(prev);
    }
  };

  return (
    <div className="dashboard">
      <header>
        <h2>{user ? `${user.name}'s Tasks` : "Your Tasks"}</h2>
        <button onClick={logout}>Log Out</button>
      </header>

      <TaskForm onCreate={createTask} />

      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet — add one above.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem key={task._id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
